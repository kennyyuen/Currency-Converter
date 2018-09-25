var rates = [];
var totalcountries;
var histtotalcountries;
var basecountrylist = ["USD","HKD"];
var targetcountrylist = ["USD","HKD"];
var commonlist = ["USD","HKD","JPY","EUR","CAD"];
var histrates = [];

class Rates {
    constructor(country, rate){
        this.rate = rate;
        this.country = country;
    }
    
}

function getRateByCountry(country){
    for (var i = 0;i < totalcountries;i++){
        if (rates[i].country == country){
            return rates[i].rate;
        }
    }
}

function getHistRateByCountry(country){
    for (var i = 0;i < histtotalcountries;i++){
        if (histrates[i].country == country){
            return histrates[i].rate;
        }
    }
}

function setCountryList(id,select){
    var common = document.createElement("optgroup");
    common.label = "Common Currency";
    var other = document.createElement("optgroup");;
    other.label = "Other Currency";
    document.getElementById(id).appendChild(common);
    document.getElementById(id).appendChild(other);
    for(var i = 0;i < totalcountries;i++){
        var temp = document.createElement("option");
        temp.value = i;
        temp.innerHTML = rates[i].country;
        if (rates[i].country == select){
            temp.selected = 'selected'
        }
        var t;
        for(var j = 0;j < commonlist.length;j++){
            if(rates[i].country == commonlist[j]){
                t = common;
                break;
            }
            else{
                t = other;
            }
        }        
        t.appendChild(temp);        
    }
}

function calRate(base,target){
    var brate = getRateByCountry(base);
    var trate = getRateByCountry(target);
    var a = $('#amount').val();
    var r = a * brate / trate;
    return r.toFixed(2);
}

function addBase(base){
    var flag = false;
    for (var i = 0;i < basecountrylist.length;i++){
        if(basecountrylist[i] == base){
            flag = true;
            return;
        }
    }
    if(!flag){
        var temp = document.createElement("td");
        temp.innerHTML = base;
        temp.className = "basecountry";
        document.getElementById("baserow").appendChild(temp);
        for(var i = 0;i < targetcountrylist.length;i++){
            var t = document.createElement("td");
            t.id = i+"r"+basecountrylist.length;
            document.getElementById(i).appendChild(t);
        }
        
        basecountrylist.push(base);
        document.getElementById("basehead").colSpan = basecountrylist.length.toString(); 
        
        console.log(basecountrylist.length.toString());
    }
}

function countryChanged(side){
    showResult();
    var countryid = document.getElementById(side).value;
    if(side == "base")
        addBase(rates[countryid].country);
    else
        addTarget(rates[countryid].country);
    setTable();
}

function addTarget(target){
    var flag = false;
    for (var i = 0;i < targetcountrylist.length;i++){
        if(targetcountrylist[i] == target){
            flag = true;
            return;
        }
    }
    if(!flag){
        var newRow = document.createElement("tr");
        newRow.id = targetcountrylist.length;
        document.getElementById("table").appendChild(newRow);
        var temp = document.createElement("td");
        temp.innerHTML = target;
        temp.className = "targetcountry";
        newRow.appendChild(temp);
        for (var i = 0;i < basecountrylist.length;i++){
            var t = document.createElement("td");
            t.id = targetcountrylist.length+"r"+i;
            newRow.appendChild(t);
        }
        targetcountrylist.push(target);
        console.log(targetcountrylist);
    }
}

function setTable(){
    showResult();
    //target
    for(var i = 0;i < targetcountrylist.length;i++){
        //base
        for(var j = 0;j < basecountrylist.length;j++){
            document.getElementById(i+"r"+j).innerHTML = calRate(basecountrylist[j],targetcountrylist[i]);
        }
    }
}

function getData(key,date){
    var url = "http://data.fixer.io/api/" + date + "?access_key=" + key + "&format=1";
    $.ajax({
        type: "GET",
        url: url,
        async: false,
        success: function (){
            console.log("worked");
        }
    }).done(function(value){
        console.log(value);
        if(date == "latest"){
            totalcountries = Object.keys(value.rates).length;
            for (var i = 0;i < totalcountries;i++){
                var c = Object.keys(value.rates)[i];
                var r = value.rates[c];
                rates[i] = new Rates(c,r);
            }
            setCountryList("base","HKD");
            setCountryList("target","USD");
            setCountryList("tablebase0","USD");
            setCountryList("tabletarget0","USD");
            setCountryList("tablebase1","HKD");
            setCountryList("tabletarget1","HKD");
            showResult();
        }
        else{
            histrates = [];
            histtotalcountries = Object.keys(value.rates).length;
            for (var i = 0;i < histtotalcountries;i++){
                var c = Object.keys(value.rates)[i];
                var r = value.rates[c];
                histrates[i] = new Rates(c,r);
            }
            document.getElementById("histbase").innerHTML = "";
            document.getElementById("histtarget").innerHTML= "";
            setCountryList("histbase","HKD");
            setCountryList("histtarget","USD");
            showRate();
        }
    });
}

function showRate(){
    var bCountry = document.getElementById("histbase").options[document.getElementById("histbase").selectedIndex].text;
    var tCountry = document.getElementById("histtarget").options[document.getElementById("histtarget").selectedIndex].text;
    var brate = getHistRateByCountry(bCountry);
    console.log(brate);
    var trate = getHistRateByCountry(tCountry);
    var r = (1 * brate / trate).toFixed(2);
    var baseicon = "<img height='30' width='30' alt='' src='images/" + bCountry + ".png'/>";
    var taricon = "<img height='30' width='30' alt='' src='images/" + tCountry + ".png'/>";
    document.getElementById("histresult").innerHTML = baseicon + "<span id='histbaseindicate'>  " + bCountry + "1  = </span>" + taricon + " " + tCountry + " " + r;
    
}

function showResult(){
    var bCountryid = $('#base').val();
    var tCountryid = $('#target').val();
    var brate = rates[bCountryid].rate;
    var trate = rates[tCountryid].rate;
    var a = $('#amount').val();
    var r = (a * brate / trate).toFixed(2);
    var baseicon = "<img height='30' width='30' alt='' src='images/" + rates[bCountryid].country + ".png'/>";
    var taricon = "<img height='30' width='30' alt='' src='images/" + rates[tCountryid].country + ".png'/>";
    document.getElementById("result").innerHTML = baseicon + "<span id='baseindicate'>  " + rates[bCountryid].country + " " + a + " = </span>" + taricon + " " + rates[tCountryid].country + " " + r;
}

function loadJSON(callback){
    var handler = new XMLHttpRequest();
    handler.overrideMimeType("application/json");
    handler.open('GET', 'key.json', true);
    handler.onreadystatechange = function () {
        if (handler.readyState == 4 && handler.status == "200") {
            callback(handler.responseText);
        }
    };
    handler.send(null);
}

function changeTheme(){
    var bt = document.getElementById("theme");
    if (bt.innerHTML == "Dark"){
        bt.innerHTML = "Light";
        bt.className = "btn btn-light";
        document.getElementById("bar").className = "navbar navbar-expand-lg navbar-dark bg-dark";
        $('body').toggleClass('dark');
        $('#amount').toggleClass('dark');
        $('#base').toggleClass('dark');
        $('#target').toggleClass('dark');
        $('#tablebase0').toggleClass('dark');
        $('#tablebase1').toggleClass('dark');
        $('#tabletarget0').toggleClass('dark');
        $('#tabletarget1').toggleClass('dark');
        $('#histbase').toggleClass('dark');
        $('#histtarget').toggleClass('dark');
        $('#date-input').toggleClass('dark');
    }
    else{
        bt.innerHTML = "Dark";
        bt.className = "btn btn-dark";
        document.getElementById("bar").className = "navbar navbar-expand-lg navbar-light bg-light";
        $('body').toggleClass('dark');
        $('#amount').toggleClass('dark');
        $('#base').toggleClass('dark');
        $('#target').toggleClass('dark');
        $('#tablebase0').toggleClass('dark');
        $('#tablebase1').toggleClass('dark');
        $('#tabletarget0').toggleClass('dark');
        $('#tabletarget1').toggleClass('dark');
        $('#histbase').toggleClass('dark');
        $('#histtarget').toggleClass('dark');
        $('#date-input').toggleClass('dark');
    }
    console.log("clicked");
}

function historyclicked(){
    document.getElementById("home").style.display = 'none';
    document.getElementById("barhome").className = "nav-item nav-link";
    document.getElementById("barhis").className = "nav-item nav-link active";
    document.getElementById("hist").style.display = 'block';
    histinit();    
}

function homeclicked(){
    document.getElementById("home").style.display = 'block';
    document.getElementById("barhome").className = "nav-item nav-link active";
    document.getElementById("barhis").className = "nav-item nav-link";
    document.getElementById("hist").style.display = 'none';
}

function tablechange(id,n){
    if(id == "base"){
        basecountrylist[n] = rates[$('#tablebase'+ n).val()].country;
        setTable();
    }
    else {
        targetcountrylist[n] = rates[$('#tabletarget'+ n).val()].country;
        setTable();
    }
}

function histinit(){
    loadJSON(function(response){
        var p = JSON.parse(response);
        var date = $('#date-input').val();
        getData(p.key,date);
    });
}

function init(){
    loadJSON(function(response){
        var p = JSON.parse(response);
        getData(p.key,"latest");
    });
}

$(document).ready(function(){
    init();
});