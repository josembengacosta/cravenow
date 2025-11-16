 // ==================================
// SISTEMA DE MAPA E LOCALIZAÇÃO
// ==================================

let map;
let userMarker;
let restaurantMarkers = [];
let userLocation = null;

// Dados mockados de restaurantes (substituir por API)
const mockRestaurants = [
    {
        id: 1,
        name: "O Paladar Angolano",
        lat: -8.8383,
        lng: 13.2344,
        category: "tradicional",
        rating: 4.8,
        deliveryTime: "30-45 min",
        deliveryFee: "KZ 1.500",
        image: "assets/img/restaurantes/paladar-angolano.jpg",
        open: true,
        delivery: true,
        distance: 1.2
    },
    {
        id: 2,
        name: "Pizzaria Napolitana",
        lat: -8.8360,
        lng: 13.2360,
        category: "pizza",
        rating: 4.5,
        deliveryTime: "20-30 min",
        deliveryFee: "Grátis",
        image: "assets/img/restaurantes/pizzaria-napolitana.jpg",
        open: true,
        delivery: true,
        distance: 0.8
    },
    {
        id: 3,
        name: "Sushi House",
        lat: -8.8400,
        lng: 13.2320,
        category: "sushi",
        rating: 4.7,
        deliveryTime: "40-60 min",
        deliveryFee: "KZ 2.000",
        image: "assets/img/restaurantes/sushi-house.jpg",
        open: true,
        delivery: true,
        distance: 2.1
    },
    {
        id: 4,
        name: "Churrascaria Brasil",
        lat: -8.8350,
        lng: 13.2380,
        category: "churrasco",
        rating: 4.6,
        deliveryTime: "35-50 min",
        deliveryFee: "KZ 1.800",
        image: "assets/img/restaurantes/churrascaria-brasil.jpg",
        open: false,
        delivery: true,
        distance: 1.5
    }
];

// Inicializar sistema de mapa
function initMapSystem() {
    // Primeiro: tentar obter localização do usuário
    getUserLocation()
        .then(location => {
            userLocation = location;
            initMap();
            updateLocationDisplay();
            loadRestaurantsOnMap();
            updateStats();
        })
        .catch(error => {
            console.error('Erro ao obter localização:', error);
            // Usar localização padrão (Luanda)
            userLocation = { lat: -8.8383, lng: 13.2344 };
            initMap();
            updateLocationDisplay(true);
            loadRestaurantsOnMap();
            updateStats();
        });

    // Event listeners
    document.getElementById('refreshLocation')?.addEventListener('click', refreshUserLocation);
    document.getElementById('locateMe')?.addEventListener('click', centerOnUserLocation);
    document.getElementById('zoomIn')?.addEventListener('click', zoomIn);
    document.getElementById('zoomOut')?.addEventListener('click', zoomOut);
    
    // Filtros
    document.getElementById('distanceFilter')?.addEventListener('change', applyFilters);
    document.getElementById('categoryFilter')?.addEventListener('change', applyFilters);
    document.getElementById('ratingFilter')?.addEventListener('change', applyFilters);
    document.getElementById('openNowFilter')?.addEventListener('change', applyFilters);
    document.getElementById('deliveryFilter')?.addEventListener('change', applyFilters);
}

// Obter localização do usuário
function getUserLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject('Geolocalização não suportada');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            position => {
                resolve({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            },
            error => {
                reject(`Erro na localização: ${error.message}`);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000
            }
        );
    });
}

// Inicializar mapa Leaflet
function initMap() {
    // Remover loading
    const mapLoading = document.getElementById('mapLoading');
    if (mapLoading) {
        mapLoading.style.display = 'none';
    }

    // Criar mapa
    map = L.map('restaurantMap').setView([userLocation.lat, userLocation.lng], 14);

    // Adicionar tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(map);

    // Adicionar marcador do usuário
    userMarker = L.marker([userLocation.lat, userLocation.lng])
        .addTo(map)
        .bindPopup('<strong>📍 Sua Localização</strong><br>Estamos a procurar restaurantes perto de si...')
        .openPopup();

    // Estilo personalizado para o marcador do usuário
    userMarker.setIcon(
        L.divIcon({
            className: 'user-location-marker',
            html: '<div style="background: #dc3545; border: 3px solid white; border-radius: 50%; width: 20px; height: 20px; box-shadow: 0 2px 10px rgba(220, 53, 69, 0.5);"></div>',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        })
    );
}

// Atualizar display da localização
function updateLocationDisplay(isDefault = false) {
    const locationDisplay = document.getElementById('currentLocationDisplay');
    if (locationDisplay) {
        if (isDefault) {
            locationDisplay.innerHTML = `
                <i class="bi bi-info-circle text-warning"></i>
                <span>Usando localização padrão (Luanda)</span>
                <br><small class="text-warning">Ative a localização para resultados mais precisos</small>
            `;
        } else {
            locationDisplay.innerHTML = `
                <i class="bi bi-check-circle text-success"></i>
                <span>Localização detetada com sucesso</span>
                <br><small>Precisão: Alta | Atualizado agora</small>
            `;
        }
    }
}

// Carregar restaurantes no mapa
function loadRestaurantsOnMap() {
    // Limpar marcadores existentes
    restaurantMarkers.forEach(marker => map.removeLayer(marker));
    restaurantMarkers = [];

    mockRestaurants.forEach(restaurant => {
        const marker = L.marker([restaurant.lat, restaurant.lng])
            .addTo(map)
            .bindPopup(createRestaurantPopup(restaurant));

        // Estilo personalizado para marcadores de restaurantes
        marker.setIcon(
            L.divIcon({
                className: 'restaurant-marker',
                html: `<div style="background: ${getMarkerColor(restaurant)}; border: 3px solid white; border-radius: 50%; width: 16px; height: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
                iconSize: [16, 16],
                iconAnchor: [8, 8]
            })
        );

        restaurantMarkers.push(marker);
    });

    updateMobileRestaurantsList();
}

// Criar popup do restaurante
function createRestaurantPopup(restaurant) {
    return `
        <div class="restaurant-popup">
            <img src="${restaurant.image}" alt="${restaurant.name}" onerror="this.src='https://via.placeholder.com/250x120/DC3545/FFFFFF?text=Restaurante'">
            <h5>${restaurant.name}</h5>
            <div class="rating">
                ${'★'.repeat(Math.floor(restaurant.rating))}${restaurant.rating % 1 !== 0 ? '½' : ''}
                <span class="text-muted">(${restaurant.rating})</span>
            </div>
            <div class="delivery-info">
                <small>
                    <i class="bi bi-clock"></i> ${restaurant.deliveryTime}<br>
                    <i class="bi bi-currency-exchange"></i> ${restaurant.deliveryFee}<br>
                    <i class="bi bi-geo-alt"></i> ${restaurant.distance} km
                </small>
            </div>
            <button class="btn btn-sm btn-danger w-100" onclick="openRestaurantModal(${restaurant.id})">
                <i class="bi bi-cart-plus"></i> Fazer Pedido
            </button>
        </div>
    `;
}

// Cor do marcador baseado no restaurante
function getMarkerColor(restaurant) {
    if (!restaurant.open) return '#6c757d';
    if (!restaurant.delivery) return '#ffc107';
    return '#28a745';
}

// Atualizar lista mobile
function updateMobileRestaurantsList() {
    const mobileList = document.getElementById('mobileRestaurantsList');
    if (!mobileList) return;

    mobileList.innerHTML = mockRestaurants.map(restaurant => `
        <div class="restaurant-mobile-item">
            <div class="d-flex justify-content-between align-items-start">
                <div>
                    <h6 class="fw-bold mb-1">${restaurant.name}</h6>
                    <div class="mb-1">
                        <span class="badge bg-success me-1">
                            <i class="bi bi-star-fill"></i> ${restaurant.rating}
                        </span>
                        <span class="badge bg-secondary">${restaurant.distance} km</span>
                    </div>
                    <small class="text-muted">
                        <i class="bi bi-clock"></i> ${restaurant.deliveryTime} • 
                        ${restaurant.deliveryFee}
                    </small>
                </div>
                <button class="btn btn-sm btn-outline-danger" onclick="openRestaurantModal(${restaurant.id})">
                    Pedir
                </button>
            </div>
        </div>
    `).join('');
}

// Atualizar estatísticas
function updateStats() {
    const totalRestaurants = mockRestaurants.length;
    const deliveryRestaurants = mockRestaurants.filter(r => r.delivery).length;

    document.getElementById('restaurantsCount').textContent = totalRestaurants;
    document.getElementById('deliveryCount').textContent = deliveryRestaurants;
}

// Funções de controle do mapa
function refreshUserLocation() {
    getUserLocation()
        .then(location => {
            userLocation = location;
            map.setView([location.lat, location.lng], 14);
            userMarker.setLatLng([location.lat, location.lng]);
            updateLocationDisplay();
        })
        .catch(error => {
            alert('Não foi possível atualizar a localização: ' + error);
        });
}

function centerOnUserLocation() {
    if (userLocation) {
        map.setView([userLocation.lat, userLocation.lng], 14);
    }
}

function zoomIn() {
    map.zoomIn();
}

function zoomOut() {
    map.zoomOut();
}

function applyFilters() {
    // Implementar lógica de filtros
    console.log('Aplicando filtros...');
}

function openRestaurantModal(restaurantId) {
    // Abrir modal do restaurante (já implementado anteriormente)
    const restaurant = mockRestaurants.find(r => r.id === restaurantId);
    if (restaurant) {
        // Usar o sistema de modal já existente
        console.log('Abrindo restaurante:', restaurant.name);
        // Aqui integraria com o modal de restaurante já criado
    }
}

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', initMapSystem);