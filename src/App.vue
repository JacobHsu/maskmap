<template>
  <div id="app">
    <Loading :active.sync="isLoading"></Loading>
    <div class="sidebar">
		<SidebarInfo></SidebarInfo>
		<div class="search">
			<div class="search-input-group">
				<label for="cityName">縣市</label>
				<select
					id="cityName"
					v-model="select.cityName"
					@change="select.areaName = ''; updateMap()"
				>
					<option
						value=""
						disabled
					>請選擇</option>
					<option
						v-for="city in cities"
						:key="city.CityName"
						:value="city.CityName"
					>
						{{city.CityName}}
					</option>
				</select>
			</div>
			<div class="search-input-group">
				<label for="areaName">地區</label>
				<select
					id="areaName"
					v-model="select.areaName"
					@change="updateMap"
				>
					<option
						value=""
						disabled
					>請選擇</option>
					<option
						v-for="area in cities.find((city) => city.CityName === select.cityName).AreaList"
						:key="area.AreaName"
						:value="area.AreaName"
					>
						{{area.AreaName}}
					</option>
				</select>
			</div>
		</div>    
		<div class="pharmacies">
			<template v-if="filterPharmacies.length !== 0">
				<template v-for="pharmacy in filterPharmacies">
					<div
						class="pharmacy"
						:key="pharmacy.properties.id"
						@click="focus(pharmacy)"
					>
						<div class="pharmacy-title">{{pharmacy.properties.name}}</div>
						<div class="pharmacy-address">{{pharmacy.properties.address}}</div>
						<div class="pharmacy-phone">{{pharmacy.properties.phone}}</div>
						<div class="pharmacy-mask-group">
							<div
								class="pharmacy-mask"
								:class="getMaskCountClass(pharmacy.properties.mask_adult)"
							>
								<div class="pharmacy-mask-title">成人口罩</div>
								<div class="pharmacy-mask-count">{{pharmacy.properties.mask_adult}}</div>
							</div>
							<div
								class="pharmacy-mask"
								:class="getMaskCountClass(pharmacy.properties.mask_child)"
							>
								<div class="pharmacy-mask-title">兒童口罩</div>
								<div class="pharmacy-mask-count">{{pharmacy.properties.mask_child}}</div>
							</div>
						</div>
					</div>
				</template>
			</template>
			<div
				v-else
				class="no-data"
			>
				沒有資料 或 請選擇地區
			</div>
		</div>	
	</div>
    <div id="map">map</div>
  </div>
</template>

<script>
import SidebarInfo from './components/SidebarInfo.vue'
import cities from "./assets/cities.json";
import streetMap, { markerIcons } from './data/map'
import { getMaskCountClass } from './common'



const createPopUp = (pharmacy) => (`
<div class="pharmacy-title">${pharmacy.properties.name}</div>
  <div class="pharmacy-address">${pharmacy.properties.address}</div>
  <div class="pharmacy-phone">${pharmacy.properties.phone}</div>
  <div class="pharmacy-mask-group">
    <div
      class="pharmacy-mask ${getMaskCountClass(pharmacy.properties.mask_adult)}"
    >
      <div class="pharmacy-mask-title">成人口罩</div>
      <div class="pharmacy-mask-count">${pharmacy.properties.mask_adult}</div>
    </div>
    <div
      class="pharmacy-mask ${getMaskCountClass(pharmacy.properties.mask_child)}"
    >
      <div class="pharmacy-mask-title">兒童口罩</div>
      <div class="pharmacy-mask-count">${pharmacy.properties.mask_child}</div>
    </div>
  </div>
`);

export default {
  name: 'app',
  components: {
	SidebarInfo
  },
  data() {
    return {
		cities,
		pharmacies: [],	
		select: {
			cityName: "新北市",
			areaName: "新店區",
		},	
        isLoading: false
    }
  },
  async mounted() {
    this.isLoading = true;
	this.streetMap = new streetMap("map", 24.976000, 121.543509);
	
	const response = await this.axios.get("https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json");
	this.pharmacies = response.data.features;

    this.updateMap();
    this.isLoading = false;
  },
  methods: {
	getMaskCountClass,
	setMarkers() {
		this.filterPharmacies.forEach((pharmacy) => {
			this.addMarker(pharmacy);
		});
	},
	addMarker(pharmacy, isOpenPopUp = false) {
		const [lng, lat] = pharmacy.geometry.coordinates;
		const { mask_adult: maskAdultCount, mask_child: maskChildCount } = pharmacy.properties;
		const icon = maskAdultCount || maskChildCount ? markerIcons.blue : markerIcons.grey;
		this.streetMap.addMarker(lat, lng, icon, createPopUp(pharmacy), isOpenPopUp);
	},
    resetMarkers() {
			this.streetMap.removeAllMarkers();
		},
    updateMap() {
			this.resetMarkers();
			this.setMarkers();

			// if (this.filterPharmacies.length !== 0) {
			// 	this.focus(this.filterPharmacies[0]);
			// }
		},
  },
  computed: {
	filterPharmacies() {
		const { cityName, areaName } = this.select;
		return this.pharmacies.filter((pharmacy) => (
			pharmacy.properties.county === cityName && pharmacy.properties.town === areaName
		));
	}
  }
}
</script>

<style>
@import "~leaflet/dist/leaflet.css";

#map {
	margin-left: 400px;
	width: calc(100% - 400px);
	height: 100vh;
}

.sidebar {
	z-index: 999;
	position: absolute;
	top: 0;
	left: 0;
	height: 100vh;
	max-height: 100vh;
	width: 400px;
	background-color: #73c0d8;
	color: white;
	box-shadow: 0px 3px 6px #00000029;
	display: flex;
	flex-direction: column;
}



.search {
	padding: 4px 0 16px;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.search-input-group {
	flex: 1;
	display: flex;
	align-items: center;
	margin: 0 16px;
}

.search-input-group label {
	font-size: 18px;
	margin-right: 8px;
}

.search-input-group select {
	flex: 1;
	display: block;
	width: 100%;
	height: 36px;
	padding: 8px 16px;
	font-size: 1rem;
	font-weight: 400;
	line-height: 1.5;
	color: #495057;
	background-color: #fff;
	background-clip: padding-box;
	border: 1px solid #ced4da;
	border-radius: 0.25rem;
	transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.pharmacies {
	overflow: auto;
}

.pharmacy {
	cursor: pointer;
	background-color: white;
	font-size: 14px;
	color: #666666;
	padding: 16px;
	border-bottom: 2px solid #d9d9d9;
	transition: all 0.3s;
}

.pharmacy:hover {
	opacity: 0.85;
}

.pharmacy-title {
	font-size: 18px;
	font-weight: bold;
	color: #333333;
	margin-bottom: 8px;
}

.pharmacy-address,
.pharmacy-phone {
	margin-bottom: 8px;
}

.pharmacy-mask-group {
	display: flex;
	justify-content: space-between;
}

.pharmacy-mask {
	width: 140px;
	height: 25px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 8px 16px;
	border-radius: 20px;
	color: white;
	font-weight: bold;
	font-size: 16px;
}

.pharmacy-mask:not(:last-child) {
	margin-right: 16px;
}

.pharmacy-mask-more {
	background-color: #73c0d8;
}

.pharmacy-mask-less {
	background-color: #ffa573;
}

.pharmacy-mask-none {
	background-color: #a5a5a5;
}
/* #app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */
</style>
