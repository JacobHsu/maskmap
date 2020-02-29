<template>
    <div class="today">
        <h2 class="today-week">{{today.getDay() | toChineseDay}}</h2>
        <div class="today-info">
            <div class="today-date">
                {{today | toDateString}}
                為<span class="today-description-high-light">
                    {{today.getDay() | toChineseEvenOrOdd}}
                </span> 購買日
            </div>
                <div class="today-description">身分證末碼為
                    <span class="today-description-high-light">
                        {{today.getDay() | toEvenOrOdd}} 
                    </span>
                    可購買
                </div>
            </div>
    </div>
</template>

<script>
export default {
  name: 'SidebarInfo',
  data() {
    return {
        today: new Date()
    }
  },
  filters: {
    toChineseDay(day) {
      const twDay = ["日", "一", "二", "三", "四", "五", "六"];
			return `星期${twDay[day]}`;
    },
    toDateString(date) {
			const pad = (n) => {
				return n < 10 ? `0${n}` : n;
			};
			return `今天 ${pad(date.getMonth() + 1)}月${pad(date.getDate())}日`;
	},
	toChineseEvenOrOdd(day) {
      return day % 2 === 0 ? "偶數" : "奇數"
    },
    toEvenOrOdd(day) {
      return day % 2 === 0 ? "2,4,6,8,0" : "1,3,5,7,9"
    }
  }
}
</script>

<style>
.today {
	padding: 16px 16px 8px;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.today-week {
	font-size: 36px;
	font-weight: normal;
	margin: 0;
}

.today-info {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
}

.today-date {
	margin-bottom: 8px;
}

.today-description {
	font-size: 14px;
}

.today-description-high-light {
	color: #fff126;
	font-size: 16px;
	font-weight: bold;
}
</style>