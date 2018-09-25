var rates = [];
var totalcountries;
var basecountrylist = ["USD","HKD"];
var targetcountrylist = ["USD","HKD"];

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

function setCountryList(id,select){
    for(var i = 0;i < totalcountries;i++){
        var temp = document.createElement("option");
        temp.value = i;
        temp.innerHTML = rates[i].country;
        if (rates[i].country == select){
            temp.selected = 'selected'
        }        document.getElementById(id).appendChild(temp);
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
        console.log(basecountrylist);
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

function getData(key){
    var url = "http://data.fixer.io/api/latest?access_key=" + key + "&format=1";
    $.ajax({
        type: "GET",
        url: url,
        async: false,
        success: function (){
            console.log("worked");
        }
    }).done(function(value){
        console.log(value);        
        totalcountries = Object.keys(value.rates).length;
        for (var i = 0;i < totalcountries;i++){
            var c = Object.keys(value.rates)[i];
            var r = value.rates[c];
            rates[i] = new Rates(c,r);
        }
        setCountryList("base","HKD");
        setCountryList("target","USD");
    });
}

function showResult(){
    var bCountryid = $('#base').val();
    var tCountryid = $('#target').val();
    var brate = rates[bCountryid].rate;
    var trate = rates[tCountryid].rate;
    var a = $('#amount').val();
    var r = (a * brate / trate).toFixed(2);
    document.getElementById("result").innerHTML = r;
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

function init(){
    loadJSON(function(response){
        var p = JSON.parse(response);
        getData(p.key);
    });
}

$(document).ready(function(){
    init();
});