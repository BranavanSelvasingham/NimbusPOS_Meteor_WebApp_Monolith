Maestro.Templates.HoursCalendar = "HoursCalendar";

Template.HoursCalendar.onCreated(function(){
	let template = this;

	template.currentWeekView = new ReactiveDict();
	template.dateToday = new Date();
	template.dateToday = new Date(template.dateToday.getFullYear(), template.dateToday.getMonth(), template.dateToday.getDate());
	template.thisWeekStartDate = new Date(template.dateToday);
	template.thisWeekStartDate.setDate(template.dateToday.getDate()-template.dateToday.getDay());

	template.employeeInfoObj;
	template.focusInputValue;

	template.allEmployeePlannedTotals = new ReactiveDict();
	template.allEmployeeActualTotals = new ReactiveDict();
	template.allDailyPlannedTotals = new ReactiveDict();
	template.allDailyActualTotals = new ReactiveDict();

	template.currentWeekView.set('payWeek', [
		{date: new Date(template.thisWeekStartDate)}, 
		{date: new Date(template.thisWeekStartDate.setDate(template.thisWeekStartDate.getDate()+1))}, 
		{date: new Date(template.thisWeekStartDate.setDate(template.thisWeekStartDate.getDate()+1))}, 
		{date: new Date(template.thisWeekStartDate.setDate(template.thisWeekStartDate.getDate()+1))}, 
		{date: new Date(template.thisWeekStartDate.setDate(template.thisWeekStartDate.getDate()+1))}, 
		{date: new Date(template.thisWeekStartDate.setDate(template.thisWeekStartDate.getDate()+1))}, 
		{date: new Date(template.thisWeekStartDate.setDate(template.thisWeekStartDate.getDate()+1))},
		{date: new Date(template.thisWeekStartDate.setDate(template.thisWeekStartDate.getDate()+1))}, 
		{date: new Date(template.thisWeekStartDate.setDate(template.thisWeekStartDate.getDate()+1))}, 
		{date: new Date(template.thisWeekStartDate.setDate(template.thisWeekStartDate.getDate()+1))}, 
		{date: new Date(template.thisWeekStartDate.setDate(template.thisWeekStartDate.getDate()+1))}, 
		{date: new Date(template.thisWeekStartDate.setDate(template.thisWeekStartDate.getDate()+1))}, 
		{date: new Date(template.thisWeekStartDate.setDate(template.thisWeekStartDate.getDate()+1))}, 
		{date: new Date(template.thisWeekStartDate.setDate(template.thisWeekStartDate.getDate()+1))} 
		]);

	template.maxCalculateRetries = 2;
	template.retriesCount = 0;

	template.calculateTablePlannedTotals = function(){
		var employeeTotal = 0;
		var currentView = template.currentWeekView.get('payWeek');
		var elementId; 
		var inputDate;

		var dailyTotal = 0;

		for (i=0; i<template.employeeInfoObj.length; i++){
			employeeTotal = 0;
			for(j=0; j<currentView.length; j++){
				inputDate = new Date(currentView[j].date);
				elementId = template.employeeInfoObj[i]._id + "_" + inputDate + "_planned";
				if(!document.getElementById(elementId) && template.retriesCount<template.maxCalculateRetries){
					template.retriesCount += 1;
					setTimeout(function(){template.calculateTablePlannedTotals();},100);
				} else {
					template.retriesCount =0;
					employeeTotal += Number(document.getElementById(elementId).value);
				}
			}
			template.allEmployeePlannedTotals.set(template.employeeInfoObj[i]._id, employeeTotal);
		}

		for(j=0; j<currentView.length; j++){
			dailyTotal = 0;
			inputDate = new Date(currentView[j].date);
			for (i=0; i<template.employeeInfoObj.length; i++){
				elementId = template.employeeInfoObj[i]._id + "_" + inputDate + "_planned";
				if(!document.getElementById(elementId) && template.retriesCount<template.maxCalculateRetries){
					template.retriesCount += 1;
					setTimeout(function(){template.calculateTablePlannedTotals();},100);
				} else {
					template.retriesCount =0;
					dailyTotal += Number(document.getElementById(elementId).value);
				}
			}
			template.allDailyPlannedTotals.set(inputDate, dailyTotal);
		}


	};

	template.calculateTableActualTotals = function(){
		var employeeTotal = 0;
		var currentView = template.currentWeekView.get('payWeek');
		var elementId; 
		var inputDate;
		
		var dailyTotal = 0;

		for (i=0; i<template.employeeInfoObj.length; i++){
			employeeTotal = 0;
			for(j=0; j<currentView.length; j++){
				inputDate = new Date(currentView[j].date);
				elementId = template.employeeInfoObj[i]._id + "_" + inputDate + "_actual";
				if(!document.getElementById(elementId) && template.retriesCount<template.maxCalculateRetries){
					template.retriesCount += 1;
					setTimeout(function(){template.calculateTableActualTotals();},100);
				} else {
					template.retriesCount =0;
					employeeTotal += Number(document.getElementById(elementId).value);
				}
			}
			template.allEmployeeActualTotals.set(template.employeeInfoObj[i]._id, employeeTotal);
		}

		for(j=0; j<currentView.length; j++){
			dailyTotal = 0;
			inputDate = new Date(currentView[j].date);
			for (i=0; i<template.employeeInfoObj.length; i++){
				elementId = template.employeeInfoObj[i]._id + "_" + inputDate + "_actual";
				if(!document.getElementById(elementId) && template.retriesCount<template.maxCalculateRetries){
					template.retriesCount += 1;
					setTimeout(function(){template.calculateTablePlannedTotals();},100);
				} else {
					template.retriesCount =0;
					dailyTotal += Number(document.getElementById(elementId).value);
				}
			}
			template.allDailyActualTotals.set(inputDate, dailyTotal);
		}
	};
});


Template.HoursCalendar.onRendered(function(){
	let template = this;
	
	$('.actualHours').hide();
	$('ul.tabs').tabs();

	template.calculateTablePlannedTotals();
});

Template.HoursCalendar.helpers({
	getPayWeekHeader: function(){
		return Template.instance().currentWeekView.get('payWeek');
	},

	formatHeaderDay: function(date){
		var dayOfWeek = date.getDay();
		var week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

		return week[dayOfWeek];
	},

	formatHeaderDateMonth: function(date){
		var monthNum = date.getMonth();
		var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		var dateString = date.getDate() + " - " + months[monthNum];

		return dateString;
	},

	isItToday: function(date){
		today = new Date();
		current = new Date(date);

		if ((today.getDate() == current.getDate())&&(today.getMonth() == current.getMonth())&&(today.getYear() == current.getYear())){
			return "#c8e6c9";
		}
	},

	getEmployees: function(){
		Template.instance().employeeInfoObj= Employees.find({},{sort: {name:1}}).fetch();
		return Employees.find({},{sort: {name:1}});
	},

	getEmployeePlannedHours: function(employeeId, date){
		for (i=0; i<Template.instance().employeeInfoObj.length; i++){
			if((Template.instance().employeeInfoObj[i]._id == employeeId)&&(Template.instance().employeeInfoObj[i].plannedHours)){			
				for(j=0; j<(Template.instance().employeeInfoObj[i].plannedHours).length; j++){
					if((Template.instance().employeeInfoObj[i].plannedHours[j].date - date) == 0){
						return Template.instance().employeeInfoObj[i].plannedHours[j].hours;
					}
				}
			}
		}
	}, 

	getEmployeeActualHours: function(employeeId, date){
		for (i=0; i<Template.instance().employeeInfoObj.length; i++){
			if((Template.instance().employeeInfoObj[i]._id == employeeId)&&(Template.instance().employeeInfoObj[i].actualHours)){			
				for(j=0; j<(Template.instance().employeeInfoObj[i].actualHours).length; j++){
					if((Template.instance().employeeInfoObj[i].actualHours[j].date - date) == 0){
						return Template.instance().employeeInfoObj[i].actualHours[j].hours;
					}
				}
			}
		}
	},

	getEmployeePlannedTableTotal: function(employeeId){
		if(Template.instance().allEmployeePlannedTotals.get(employeeId)){
			return Template.instance().allEmployeePlannedTotals.get(employeeId);
		}
	},

	getEmployeeActualTableTotal: function(employeeId){
		if(Template.instance().allEmployeeActualTotals.get(employeeId)){
			return Template.instance().allEmployeeActualTotals.get(employeeId);
		}
	},

	getDailyPlannedTableTotal: function(date){
		if(Template.instance().allDailyPlannedTotals.get(date)){
			return Template.instance().allDailyPlannedTotals.get(date);
		}
	},

	getDailyActualTableTotal: function(date){
		if(Template.instance().allDailyActualTotals.get(date)){
			return Template.instance().allDailyActualTotals.get(date);
		}
	}
});


Template.HoursCalendar.events({
	'click .plannedHoursInput': function(event, template){
		var element = event.target;
		template.focusInputValue = Number(element.value);
	},

	'blur .plannedHoursInput': function(event, template){
		var element = event.target;
		var employeeId = element.dataset.employeeId;
		var hoursDate = new Date(element.dataset.date);
		var hours = Number(element.value);
		
		var hoursObj = {
			plannedHours:{
							date: hoursDate,
							hours: hours
						}
		};

		var removeHoursObj = {
			plannedHours:{date: hoursDate}
		};

		if(hours>0){
			Meteor.call("pullEmployeeHours", employeeId, removeHoursObj, function(error, result) {
	            if(error) {
	                console.log(error);
	            } else {
					Meteor.call("pushEmployeeHours", employeeId, hoursObj, function(error, result) {
		            if(error) {
		                console.log(error);
		            } else {
		                Materialize.toast("Updated hours", 500);
		                template.calculateTablePlannedTotals();
		            }
	       			});
	            }
	        });

	    } else if (!hours && template.focusInputValue){
			Meteor.call("pullEmployeeHours", employeeId, removeHoursObj, function(error, result) {
	            if(error) {
	                console.log(error);
	            } else {
	                Materialize.toast("Removed hours", 500);
	                template.calculateTablePlannedTotals();
	            }
	        });

	    }

	},

	'click .actualHoursInput': function(event, template){
		var element = event.target;
		template.focusInputValue = Number(element.value);

	},

	'blur .actualHoursInput': function(event, template){
		var element = event.target;
		var employeeId = element.dataset.employeeId;
		var hoursDate = new Date(element.dataset.date);
		var hours = Number(element.value);
		
		var hoursObj = {
			actualHours:{
							date: hoursDate,
							hours: hours
						}
		};

		var removeHoursObj = {
			actualHours:{date: hoursDate}
		};

		if(hours>0){
			Meteor.call("pullEmployeeHours", employeeId, removeHoursObj, function(error, result) {
	            if(error) {
	                console.log(error);
	            } else {
					Meteor.call("pushEmployeeHours", employeeId, hoursObj, function(error, result) {
			            if(error) {
			                console.log(error);
			            } else {
			                Materialize.toast("Updated hours", 500);
			                template.calculateTableActualTotals();
			            }
	       			});
	            }
	        });

	    } else if (!hours && template.focusInputValue){
			Meteor.call("pullEmployeeHours", employeeId, removeHoursObj, function(error, result) {
	            if(error) {
	                console.log(error);
	            } else {
	                Materialize.toast("Removed hours", 500);
	                template.calculateTableActualTotals();
	            }
	        });

	    }

	},

	'click #nextPayPeriod': function(event, template){
		console.log('next pay period');
		template.currentWeekView.set('payWeek', [
			{date: new Date(template.thisWeekStartDate.setDate(template.thisWeekStartDate.getDate()+1))},
			{date: new Date(template.thisWeekStartDate.setDate(template.thisWeekStartDate.getDate()+1))}, 
			{date: new Date(template.thisWeekStartDate.setDate(template.thisWeekStartDate.getDate()+1))}, 
			{date: new Date(template.thisWeekStartDate.setDate(template.thisWeekStartDate.getDate()+1))}, 
			{date: new Date(template.thisWeekStartDate.setDate(template.thisWeekStartDate.getDate()+1))}, 
			{date: new Date(template.thisWeekStartDate.setDate(template.thisWeekStartDate.getDate()+1))}, 
			{date: new Date(template.thisWeekStartDate.setDate(template.thisWeekStartDate.getDate()+1))},
			{date: new Date(template.thisWeekStartDate.setDate(template.thisWeekStartDate.getDate()+1))}, 
			{date: new Date(template.thisWeekStartDate.setDate(template.thisWeekStartDate.getDate()+1))}, 
			{date: new Date(template.thisWeekStartDate.setDate(template.thisWeekStartDate.getDate()+1))}, 
			{date: new Date(template.thisWeekStartDate.setDate(template.thisWeekStartDate.getDate()+1))}, 
			{date: new Date(template.thisWeekStartDate.setDate(template.thisWeekStartDate.getDate()+1))}, 
			{date: new Date(template.thisWeekStartDate.setDate(template.thisWeekStartDate.getDate()+1))}, 
			{date: new Date(template.thisWeekStartDate.setDate(template.thisWeekStartDate.getDate()+1))} 
			]);

		setTimeout(function(){
			template.calculateTablePlannedTotals();
			template.calculateTableActualTotals();}, 100);

	},

	'click #previousPayPeriod': function(event, template){
		console.log("previous");
		template.currentWeekView.set('payWeek', [
			{date: new Date(template.thisWeekStartDate.setDate(template.thisWeekStartDate.getDate()-27))},
			{date: new Date(template.thisWeekStartDate.setDate(template.thisWeekStartDate.getDate()+1))}, 
			{date: new Date(template.thisWeekStartDate.setDate(template.thisWeekStartDate.getDate()+1))}, 
			{date: new Date(template.thisWeekStartDate.setDate(template.thisWeekStartDate.getDate()+1))}, 
			{date: new Date(template.thisWeekStartDate.setDate(template.thisWeekStartDate.getDate()+1))}, 
			{date: new Date(template.thisWeekStartDate.setDate(template.thisWeekStartDate.getDate()+1))}, 
			{date: new Date(template.thisWeekStartDate.setDate(template.thisWeekStartDate.getDate()+1))},
			{date: new Date(template.thisWeekStartDate.setDate(template.thisWeekStartDate.getDate()+1))}, 
			{date: new Date(template.thisWeekStartDate.setDate(template.thisWeekStartDate.getDate()+1))}, 
			{date: new Date(template.thisWeekStartDate.setDate(template.thisWeekStartDate.getDate()+1))}, 
			{date: new Date(template.thisWeekStartDate.setDate(template.thisWeekStartDate.getDate()+1))}, 
			{date: new Date(template.thisWeekStartDate.setDate(template.thisWeekStartDate.getDate()+1))}, 
			{date: new Date(template.thisWeekStartDate.setDate(template.thisWeekStartDate.getDate()+1))}, 
			{date: new Date(template.thisWeekStartDate.setDate(template.thisWeekStartDate.getDate()+1))} 
			]);		

		setTimeout(function(){
			template.calculateTablePlannedTotals();
			template.calculateTableActualTotals();}, 100);
	},

	'click #showPlanned': function(event, template){
		$('.plannedHours').show();
		$('.actualHours').hide();

		template.calculateTablePlannedTotals();

	},

	'click #showActuals': function(event, template){
		$('.plannedHours').hide();
		$('.actualHours').show();

		template.calculateTableActualTotals();


	}
});