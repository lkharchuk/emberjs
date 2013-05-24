App = Ember.Application.create({
	random:1,
	rootElement: 'body',
	picCount:6
});

App.Store = DS.Store.extend({
	revision: 12,
	adapter: 'DS.FixtureAdapter'
	/*init: function() {
        this._super();
		//preloaded
		this.loadMany(App.Costs, App.Costs.FIXTURES);       
		this.loadMany(App.Kyivrada, App.Kyivrada.FIXTURES);        		
    }*/
	/*
	adapter: DS.RESTAdapter.extend({
		url: 'http://'
	})
	*/
});

/************************ROUTES***************************************/
App.Router.map(function(){
  this.resource('documents');
  this.resource('fight');  
  this.resource('costs');
  this.resource('kyivrada');
  this.resource('map');
  this.resource('voits');
    this.resource('events');
});

App.CostsRoute = Ember.Route.extend({
	model: function() {
		return App.Costs.find();
	}
});

App.KyivradaRoute = Ember.Route.extend({  
  model: function() {
    return App.Kyivrada.find();
  }
});

App.DocumentsRoute = Ember.Route.extend({  
  model: function() {
    return App.Documents.find();
  }
});

App.EventsRoute = Ember.Route.extend({  
  model: function() {
    return App.Events.find();
  }
});

App.VoitsRoute = Ember.Route.extend({
    model: function () {
        return App.Voits.all();
    }
});


/************************Controlles***************************************/
App.ApplicationController = Ember.Controller.extend({
	title:'Підтримайте',
	isShowContact:false,
	url:function(){	
		return "/content/images/render/"+App.random+".png";
	}.property('content.url','App.random')	,
	showContact:function(){		
		this.set("isShowContact",!this.get("isShowContact"));
		return false;
	}	
});

App.DocumentsController = Ember.ObjectController.extend({
	zoom:function(src){	
		var popupWin=window.open (src, "documents","location=1, status=1, scrollbars=1, width=476,height=718");
		popupWin.focus();
	}
});

App.EventsController = Ember.ObjectController.extend({
	goto:function(data){	
		location.href="#"+data;
	}
});


App.CostsController = Ember.ArrayController.extend({	
	result: function() {
		var content=this.get('content').getEach("sum");
		if(content.length>0){
			return (eval(content.join().replace(/\,/g,'+')));
		}
	}.property('content.@each'),
	
	lastDate:function(){
		var content=this.get('content').getEach("date");
		if(content.length>0){
			return content.slice(-1)[0];
		}
		return moment(this.get("date")).format('LLL');
	}.property('content.@each')	
});


/************************Views***************************************/
App.ApplicationView=Ember.View.extend({
	click:function(evt){
		this.set("context.isShowContact",false);
	},
	mouseOver: function(evt){
		//console.log(2);
	}
});

App.ContactView=Ember.View.extend({
	click:function(evt){
		return false;
	}
});

/********************Helpers**************************/
Ember.Handlebars.registerBoundHelper('format', 
	function(date){
		return moment(date, "DD.MM.YY HH:mm").format('LLL');
	}
);


/********************MODELS**************************/

App.Costs = DS.Model.extend({
	date: DS.attr('string'),
	time: DS.attr('string'),
	sum: DS.attr('number'),
	person: DS.attr('string')
});

App.Kyivrada = DS.Model.extend({
	title: DS.attr('string'),	
	deputates: DS.attr('string'),
	len: function(){
		return this.get("deputates").split(',').length;
	}.property('deputates')
});

App.Documents = DS.Model.extend({
	title: DS.attr('string'),
	count: DS.attr('number'),
	prefix: DS.attr('string'),
	src: function(){
		var arr=[],
			prefix=this.get("prefix"),
			len=this.get("count");
		while (len){
			arr.push("/content/docs/"+prefix+"-"+len+".jpg");
			len--;
		}
		arr.sort();
		return arr;
	}.property('count','prefix')
});

App.Events = DS.Model.extend({
	date: DS.attr('string'),
	title: DS.attr('string'),	
	text: DS.attr('string'),
	hashlink: function(){
		return "#"+this.get("date");
	}.property('date')
});


App.Voits = Ember.ArrayController.extend();

/********************DATA**************************/
App.Kyivrada.FIXTURES=[
	{id:1, title:"Не голосували", deputates: "Андрієвський Д. Й. 70, Борисенко С. І. 84, Бригинець О. М. 36, Гоцький М. М. 96, Демінський П. В. 10, Дмитрук Ю. П. 39, Дробот Б. В. 12, Закревська Л. О. 68, Іонова М. М. 19, Іщенко В. О. 22, Карпунцов В. В. 26, Клюс О. В. 20, Кобєлєв В. І. 28, Козир С. В. 23, Козіс О. М. 29, Костржевський Д. Б. 30, Курінний Ю. Ю. 47, Куровський О. І. 61, Ліщенко О. В. 65, Лук'янюк М. В. 67, Мельник М. І. 71, Мельник С. М. 18, Миргородський А. С. 73, Науменко В. М. 31, Наумко В. М. 41, Новак І. В. 80, Новак Н. В. 81, Овраменко О. В. 91, Олійник Д. М. 82, Паламарчук М. П. 85, Парцхаладзе Л. Р. 86, Петькун О. Д. 35, Пономаренко В. М. 89, Сенчук В. В. 94, Старостенко Г. В. 104, Тищенко В. І. 87, Толубицький О. П. 24, Шевченко А. А. 79, Штейнас Р. Б. 113, Ярцев В. М. 117"}, 
	{id:2,  title:"Проти",  deputates: "Береговий Ю. М. 5, Давиденко О. В. 2, Дробот В. І. 11, Зінченко О. О. 17, Меліхова Т. І. 37, Москаль Д. Д. 75, Незнал О. Г. 32, Нікульшин Д. О. 77, Семинога В. І. 16"}, 
	{id:3,  title:"За",   deputates: "Баленко І. М. 118, Баранов-Мохорт С. М. 3, Березенко С. І. 50, Бічук Ю. В. 6, Бондар Ю. І. 105, Брезвін А. І. 119, Булгаков Ю. К. 7, Гавриленко Б. Б. 9, Гавриленко О. Б. 8, Герега Г. Ф. 107, Голиця М. М. 120, Гречківський П. М. 51, Грінюк В. Р. 55, Дейнега В. П. 99, Довгий О. С. 43, Драпій О. Ф. 40, Євлах О. Ю. 4, Журавський В. С. 13, Заєць А. Г. 42, Заєць О. Г. 14, Засенко О. Ю. 15, Іванов П. Ф. 57, Ішунінов Ю. Г. 49, Казаков Д. Ю. 103, Капленко А. С. 25, Качкан О. В. 27, За Кононенко І. В. 44, Костюк С. М. 33, Кримчак С. О. 34, Курилич М. Я. 38, Лаврененко В. І. 59, Лавров І. С. 62, Ламбуцький М. М. 21, Лебідь П. Д. 64, Лойфенфельд О. Я. 66, Мельничук Л. Ю. 72, Миронова З. М. 74, Мошенський В. З. 76, Омельяненко О. А. 98, Пабат О. В. 101, Павлик В. А. 83, Пашко П. В. 53, Резнікович М. І. 93, Саврасов М. В. 56, Самохін О. Ю. 54, Семенюк А. М. 92, Сергійчук В. О. 95, Славная О. В. 97, Слепкань С. П. 100, Слободян Р. Б. 102, Супруненко В. І. 46, Тесленко П. П. 106, Філатов Я. О. 108, Черновецький С. Л. 48, Чуб А. В. 58, Шевчук Є. Є. 109, Шлапак А. В. 60, Шлапак В. Л. 110, Шовкун І. В. 111, Шпак І. В. 112, Щербинська Я. В. 114, Яковчук М. Ю. 52, Ярошенко Р. В. 116"}, 
	{id:4,  title:"Утримались", deputates: "Антонова, Кличко, Коваленко, Лановий, Медведєв, Плачков, Резніков, Черновецький"}
];

App.Documents.FIXTURES = [
	{id:1,title:'Документи на садочок',count:3, prefix:'sad'},
	{id:2,title:'Наше звернення президенту України та іншим державним організаціям',count:7, prefix:2},
	{id:3,title:'Витяг з протоколу №15 засідання Київради',count:2, prefix:'vutiag'},
	{id:4,title:'Зобов\'язання Голосіївської РДА виступити замовником будівництва дитячого садка',count:1, prefix:'zoyava'},
	{id:5,title:'Містобудівний Розрахунок',count:5, prefix:"cost"},
	{id:6,title:'Пропозиції громадян та стратегії розвитку м.Києва до 2025',count:1, prefix:"prop"},
	{id:7,title:'План садочку',count:2, prefix:"plan"}
];

App.Costs.FIXTURES=[
	{id:1,  date:"14.03.13 11:54", sum: 300,  person:"Воеводин Андрей Анатольевич"}, 
	{id:2,  date:"15.03.13 11:18", sum: 100,  person:""},
	{id:3,  date:"19.03.13 11:55", sum: 200,  person:""}, 
	{id:4,  date:"19.03.13 12:34", sum: 100,  person:"Романчук Александр Васильевич"}, 
	{id:5,  date:"19.03.13 15:09", sum: 100,  person:""}, 
	{id:6,  date:"20.03.13 09:10", sum: 200,  person:""},  
	{id:7,  date:"20.03.13 11:20", sum: 50,   person:""}, 
	{id:8,  date:"20.03.13 12:40", sum: 50,   person:""}, 
	{id:9,  date:"20.03.13 17:19", sum: 100,  person:""}, 
	{id:10, date:"20.03.13 20:34", sum: 100,  person:"Терефера Елена Александровна"}, 
	{id:11, date:"20.03.13 20:52", sum: 300,  person:""}, 
	{id:12, date:"26.03.13 16:56", sum: 300,  person:"Артюх Наталья Викторовна"},
	{id:13, date:"30.03.13 13:42", sum: 100,  person:"Броска Владислав Федорович"},
	{id:14, date:"31.03.13 19:12", sum: 1000, person:""},
	{id:15, date:"01.04.13 17:58", sum: 100,  person:"Малышева Светлана Анатольевна "},
	{id:16, date:"04.04.13 08:56", sum: 100,  person:"Романчук Александр Васильевич "},
	{id:17, date:"05.04.13 16:00", sum: 100,  person:""},
	{id:18, date:"11.04.13 21:03", sum: 150,  person:"Пеклин Игорь Петрович"},
	{id:19, date:"12.04.13 20:08", sum: 100,  person:""},
	{id:20, date:"13.04.13 11:14", sum: 200,  person:""},
	{id:21, date:"14.04.13 10:18", sum: 50,   person:""},
	{id:22, date:"15.04.13 17:34", sum: 300,  person:""},
	{id:23, date:"16.04.13 10:22", sum: 200,  person:"Воеводин Андрей Анатольевич "},
	{id:24, date:"16.04.13 13:02", sum: 100,  person:"Шкотова Людмила Васильевна"},
	{id:25, date:"16.04.13 15:48", sum: 300,  person:"Артюх Наталья Викторовна"},
	{id:26, date:"19.04.13 08:10",sum:800,  person:""},
	{id:27, date:"23.04.13 08:12",sum:200,  person:""},
	{id:28, date:"23.04.13 11:17",sum:50,  person:""},
	{id:29, date:"24.04.13 08:08",sum:500 ,  person:"Юрах Тарас Омельянович"},
	{id:30, date:"05.04.13 18:43",sum:100 ,  person:""},
	{id:31, date:"26.04.13 11:22",sum:150 ,  person:" Кравченко Игорь Леонидович"},
	{id:32, date:"29.04.13 14:08",sum:250 ,  person:"Александр (Fantom)"},
	{id:33, date:"29.04.13 17:28",sum:300 ,  person:"Бовкун Дмитрий Николаевич"},
	{id:34, date:"13.05.13 13:51",sum:200 ,  person:""},
	{id:35, date:"17.05.13 10:09",sum:100 ,  person:" Сиротина Екатерина Сергеевна"}
];

App.Events.FIXTURES=[
	{id:1, date:"31.07.2007",title: "Управління Генплану здійснило погодження на схемі генерального плану 3-го мікрорайону",text: 'Проект будівництва Ліко-Холдингу погоджено як такий, що відповідає Генеральному плану. Це деталізована схема будівництва з чітким визначенням місцезнаходження дитячого садочку та школи.	'},
	{id:2, date:"31.08.2007",title: "Лист Київголовархітектури № 07-8995	",text: 'Проектна документації Ліко-Холдингу погоджена Київголовархітектурою	'},
	{id:3, date:"14.11.2007",title: "Лист Голосіївської РДА №535-989	",text: 'Дитячому садку присвоєно поштову адресу А.Вільямса,7	'},
	{id:4, date:"05.12.2007",title: "Позитивний висновок Київдержекспертизи № 5928 	",text: 'Відбулася комплексна державна експертиза проекту будівництва Ліко-Холдингу. Згідно висновку у проекті заплановано соціальна інфраструктура: дитячий садочок на 230 місць та школа на 33 класи. Як і вимагає закон, при комплексній забудові нового кварталу повинні бути заплановані дитячі садки та школи згідно держаних будівельних норм (ДБН). Держава повинна фінансувати будівництво державних дитячих садочків та шкіл за рахунок відрахувань забудовника до бюджету та за рахунок сплати податків до бюджету Києва юридичними та фізичними особами.	'},
	{id:5, date:"13.12.2007",title: "дозвіл на будівництво № 2872-ГЛ/С	",text: 'Лико-Холдингу видано дозвіл на будівництво Управлінням архутектурно-будівельного контролю.	'},
	{id:6, date:"01.04.2008",title: "Лист Черновецького Л.М. № Д-3878 від 01.01.2008	",text: 'Надано згода Черновецького на розроблення проекту відведення земельної ділянки для Національного Банку України. З цього моменту почався процесс оформлення дозвілів на відвід землі на користь НБУ. При цьому (очевидно для маскування) адреса земельної ділянки для дитячого садочку була змінена на Вільямса,10, при тому що це непарна сторона вулиці і вже існувала така адреса навпроти через дорогу (за неперевіреною інформаціїю це земельна ділянка голови Голосіївської РДА Незнала).	'},
	{id:7, date:"24.09.2008",title: 'Лист Органу самооргінізації населення "Теремки-2" до НБУ №20 	',text: 'Орган самооргінізації населення "Теремки-2 просить НБУ не забирати землю, бо вона запланована для дитячого садочку. На цей лист НБУ відповідає відмовою.	'},
	{id:8, date:"26.09.2008",title: "Лист Ліко-Холдингу до НБУ №113	",text: 'Ліко-Холдинг просить НБУ не забирати землю, бо вона запланована для дитячого садочку. На цей лист НБУ відповідає відмовою.	'},
	{id:9, date:"17.09.2009",title: "Засідання Київради	",text: '17 вересня 2009 року засідання Київради (депутати повідомили, що на даній ділянці передбачається будівництво дитячого садка та про відсутність згоди ДП"Науково-дослідний, виробничий агрокомбінат "Пуща-Водиця"на вилучення земельної ділянки)	'},
	{id:10, date:"23.11.2009",title: "Лист Голосіїської РДА № 02/2483	",text: '23 листопада 2009 року лист Голосіївської РДА Голові міста Черновецькому про неможливість будівництва житлового будинку замість дитячого садка	'},
	{id:11, date:"27.11.2009",title: "Рішення Київради № 754/2823	",text: 'Землю під дитячий садочок Киїірада віддала НБУ, не зважаючи на протести у сесійній залі голови Голосіївської РДА та його доводи, що там має бути дитячий садочок за генеральним планом Києва. Щоб нібито вирішити цю "незручну" деталь, О.Довгий протягнув рішення, зобов"язавши НБУ передбачити об’єкти соц..інфраструктури при будівництві будинку. Згідно тексту рішення Киїради Національний банк було зобов"язано виконати розрахунки (розрахунок був 230-240 місць у дитячому садку!) щодо забеспеченності населення об"єктами соціальної сфери (дитячий садочок) та передбачити їх розміщення та будівництво одночасно із спорудженням житлових будіників.	'},
	{id:12, date:"25.05.2010",title: "Державний акт	",text: 'НБУ видано Державний акт на право постійного користування земельною ділянкою НБУ №07-9-00-114 від 25.05.2010'},
	{id:13, date:"20.12.2010",title: "Мстобудівні умови та обмеження Київголовархітектури № 009-372	",text: 'Київголовархітектура видає НБУ містобудівні умови і обмеженні земельної ділянки, де НБУ дозволили побудувати разом із житловими будинками дитячий садочок лише на 60 місць!!! Цей розразунок проводився тільки виходячи з потреб будинків НБУ, а існуючий розрахунок по всьому району на 230-240 місць був проігнорований! Тобто фактично Київ "злив" потребу у дитячому садочку всього мікрорайону, тепер НБУ повинен будувати дитячий садочок лише для своїх робітників та за кошти НБУ. ситуація зараз		Коштів у державном бюджеті для будівництва дитячого садочку немає, тому проблему дитячого садочка Київська влада просто ігнорує!!! Навпаки, подарувавши землю НБУ, Київська рада фактично зняла з себе обов"язки фінансування будіництва державного дитячого садочку.'}
	];

App.Voits.reopenClass({
    all: function() {
        var outgoings = [];
        var apiPage = "messages";
        var parameters_string = "action=outgoing";
        var url = "/services/voite.asmx/getVoits";
       
        // console.log(url);
        var response = $.ajax({
            type: "GET",
            url: url,
            dataType: "text json",
            success: function(data){
                return data;
                // return JSON.parse(data)
                alert('Its working');   //It will alert when you ajax call returns successfully.
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(JSON.stringify(jqXHR));
                console.log("AJAX error: " + textStatus + ' | ' + errorThrown);
            }
        }).done(function(response) {
            response.forEach( function (outgoing) {
                outgoings.pushObject( App.Voits.create(outgoing) );
            });
        });
        return outgoings;
    }
});

/********************other**************************/
if(App.get("picCount")>1){
	setInterval(function(){
		App.set('random',Math.floor((Math.random()*App.get("picCount"))+1));		
	}, 5000);
}

