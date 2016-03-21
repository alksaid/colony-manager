app.section('session');

viewModel.session = {}; var ses = viewModel.session;
  
ses.SessionColumns = ko.observableArray([
	{ field: "status", title: "" },
	{ field: "username", title: "Username" },
	{ field: "created", title: "Created", template:'# if (created == "0001-01-01T00:00:00Z") {#-#} else {# #:moment(created).utc().format("DD-MMM-YYYY HH:mm:ss")# #}#' },
	{ field: "expired", title: "Expired", template:'# if (expired == "0001-01-01T00:00:00Z") {#-#} else {# #:moment(expired).utc().format("DD-MMM-YYYY HH:mm:ss")# #}#' },
	{ field: "duration", title: "Active In", template:'#= kendo.toString(duration, "n2")# H'},
	{ title: "", width: 80, attributes: { class: "align-center" }, template:"#if(status=='EXPIRED'){# <button data-value='#:_id #' onclick='ses.setexpired(\"#: _id #\", \"#: username #\")' name='expired' type='button' class='btn btn-sm btn-default btn-text-danger btn-stop tooltipster' title='Set Expired'><span class='fa fa-stop'></span></button> #}else{# #}#" }
	// { title: "", width: 80, attributes: { class: "align-center" }, template: function (d) {
	// 	if (status == "ACTIVE") {
	// 		return [
	// 			"<button class='btn btn-sm btn-default btn-text-success tooltipster' onclick='ses.selectGridSession(\"" + d._id + "\")' title='Set Expired'><span class='fa fa fa-times'></span></button>"
	// 		].join(" ");
	// 	}
	// 	return ""
	// } }
]); 

ses.SessionData=ko.observableArray([]);
ses.selectGridSession = function (e) {
	// adm.isNew(false);
	app.wrapGridSelect(".grid-sessions", ".btn", function (d) {
		// adm.editAccess(d._id); 
		// adm.showAccess(true);
		// app.mode("editor"); 
	});
};
ses.getSession = function(c) {
	 
	ses.SessionData([]);
	var param = {};
	app.ajaxPost("/session/getsession", param, function (res) {
		if (!app.isFine(res)) {
			return;
		}
		if (res.data==null){
			res.data="";
		}
		// console.log(res)
		ses.SessionData(res.data);
		var grid = $(".grid-sessions").data("kendoGrid"); 
		$(grid.tbody).on("mouseleave", "tr", function (e) {
		    $(this).removeClass("k-state-hover");
		});

		if (typeof c == "function") {
			c(res);
		}
	});
};
 
ses.setexpired = function (_id,username) {
	var param ={ _id: _id };
	app.ajaxPost("/session/setexpired", param, function (res) {
		if (!app.isFine(res)) {
			return;
		}

		ses.getSession()
		// wg.selectedID(_id);
		// app.mode('history');
		// wg.historyData(res.data);
	});
} 
 
// ses.editGroup = function(c) {
// 	var payload = ko.mapping.toJS(ses.filter._id(c));
// 	app.ajaxPost("/session/findsession", payload, function (res) {
// 		if (!app.isFine(res)) {
// 			return;
// 		}
// 		if (res.data==null){
// 			res.data="";
// 		}
// 		ses.config._id(res.data._id);  
// 		ses.config.Title(res.data.Title);  
// 		ses.config.Enable(res.data.Enable);  
// 		ses.config.Grants(res.data.Grants); 
// 		ses.config.Owner(res.data.Owner);  
// 	});
// };

 
$(function () {
	ses.getSession(); 
});

