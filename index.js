let minut = 0;
let hour = 0;
let sec = 0;
let touchtime = 0;
let subscription = null;
const start = document.getElementById('start')
const stop = document.getElementById('stop')
const wait = document.getElementById('wait')
const reset = document.getElementById('reset')
const stopwatch = document.getElementById('stopwatch')

const getPartTime = (value) => value === 0 ? '00' : value > 0 && value <= 9 ? `0${value}` : value;

function tick() {
	sec++;

	if (sec === 60) {
		minut++;
		sec = 0
	}

	if (minut === 60) {
		hour++;
		minut = 0
	}

	if (hour === 24) {
		hour = 0
	}

	return `${getPartTime(hour)}:${getPartTime(minut)}:${getPartTime(sec)}`
}

const resetTimerValues = () => {
	minut = 0;
	hour = 0;
	sec = 0;
}

const timer = new Rx.Observable(observer => {
	const intervalTick = setInterval(() => {
		observer.next(tick())
	}, 1000);

	return () => {
		clearInterval(intervalTick);
	}
})

start.addEventListener('click', () => {
	subscription = timer.subscribe({ next: value => stopwatch.innerHTML = value });
})
stop.addEventListener('click', () => {
	if (!subscription) {
		return
	}

	subscription.unsubscribe()
	resetTimerValues();
	stopwatch.innerHTML = '00:00:00'

})

wait.addEventListener('click', () => {
	if (!subscription) {
		return
	}

	if (touchtime === 0) {
		touchtime = new Date().getTime();
	} else {
		if (((new Date().getTime()) - touchtime) < 300) {
			subscription.unsubscribe()
		} else {
			touchtime = new Date().getTime();
		}
	}
})

reset.addEventListener('click', () => {
	if (!subscription) {
		return
	}

	subscription.unsubscribe()
	resetTimerValues();
	subscription = timer.subscribe({ next: value => stopwatch.innerHTML = value });
})
