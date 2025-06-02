const {CronJob} = require('cron')
const job = new CronJob(
	'0 0 * 1-2 1-2', // cronTime
	function () {
		console.log(`At 00:00 on every day-of-week from Monday through Tuesday 
            in every month from January through February.`);
	}
);
job.start()