var rates = [];
var totalcountries;
var histtotalcountries;
var basecountrylist = ["USD","HKD"];
var targetcountrylist = ["USD","HKD"];
var commonlist = ["USD","HKD","JPY","EUR","CAD"];
var histrates = [];

//rates class
class Rates {
    constructor(country, rate){
        this.rate = rate;
        this.country = country;
        if(country != "BTC"){
            this.code = country.substring(0,2);
        }
        else {
            this.code = country;
        }
    }
    
}

//Get rate function
function getRateByCountry(country){
    for (var i = 0;i < totalcountries;i++){
        if (rates[i].country == country){
            return rates[i].rate;
        }
    }
}
//Get historical rate
function getHistRateByCountry(country){
    for (var i = 0;i < histtotalcountries;i++){
        if (histrates[i].country == country){
            return histrates[i].rate;
        }
    }
}

//Dropdown function
function setDropDownList(id,parentID){
    var div = document.getElementById(id);
    for(var i = 0;i < totalcountries;i++){
        var temp = document.createElement("a");
        var image = "<img class='flag' alt='' src='https://www.countryflags.io/"+ rates[i].code + "/flat/32.png'>";
        if(rates[i].code == "BTC"){
            image = "<img src='images/BTC.png'>";
        }
        temp.id = i;
        temp.innerHTML = image + rates[i].country;
        temp.onclick = listClicked;
        temp.setAttribute("parentButtonID",parentID);  
        div.appendChild(temp);
    }
}
// dropdown button
function dropDownClicked(id) {
    document.getElementById(id).classList.toggle("show");
}
// dropdown list clicked
function listClicked(){
    console.log(this.id);
    document.getElementById(this.getAttribute("parentButtonID")).innerHTML = document.getElementById(this.id).innerHTML;
    document.getElementById(this.parentNode.id).classList.toggle("show");
}
// dropdown search function
function filterFunction(dropdowndivID,inputID) {
    var input, filter, ul, li, a, i;
    input = document.getElementById(inputID);
    filter = input.value.toUpperCase();
    div = document.getElementById(dropdowndivID);
    a = div.getElementsByTagName("a");
    for (i = 0; i < a.length; i++) {
        if (a[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
            a[i].style.display = "";
        } else {
            a[i].style.display = "none";
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

//calucate function
function calRate(base,target){
    var brate = getRateByCountry(base);
    var trate = getRateByCountry(target);
    var a = $('#amount').val();
    var r = a * brate / trate;
    return r.toFixed(2);
}

//table function
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

//show historical rate
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
    /*
    var bCountryid = $('#base').val();
    var tCountryid = $('#target').val();
    var brate = rates[bCountryid].rate;
    var trate = rates[tCountryid].rate;
    var a = $('#amount').val();
    var r = (a * brate / trate).toFixed(2);
    var baseicon = "<img height='30' width='30' alt='' src='images/" + rates[bCountryid].country + ".png'/>";
    var taricon = "<img height='30' width='30' alt='' src='images/" + rates[tCountryid].country + ".png'/>";
    document.getElementById("result").innerHTML = baseicon + "<span id='baseindicate'>  " + rates[bCountryid].country + " " + a + " = </span>" + taricon + " " + rates[tCountryid].country + " " + r;
    */
    
    
}


//button event function
//nav bar button
function tabClicked(tab){
    if(tab == "home"){
        document.getElementById("home").style.display = 'block';
        $('#barhome').toggleClass('act');
        $('#barhis').toggleClass('act');
        document.getElementById("hist").style.display = 'none';
    }
    else if(tab == "hist"){
        document.getElementById("home").style.display = 'none';
        $('#barhome').toggleClass('act');
        $('#barhis').toggleClass('act');
        document.getElementById("hist").style.display = 'block';
        init("hist");
    }
        
}

//orientation button
function orienClicked(){
    var image = document.getElementById("indicateimage");
    if(image.innerHTML == "🡣") {
        image.innerHTML = "🡢";
    }
    else {
        image.innerHTML = "🡣";
    }
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

//initialize function
function init(temp){
    loadJSON(function(response){
        var p = JSON.parse(response);
        var date = $('#date-input').val();
        if(temp == "latest"){
            getData(p.key,"latest");
        }
        else {
            getData(p.key,date);
        }
    });
}

//Read key from json file
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
            //setDropDownList("bDrop","bButton");
            //setDropDownList("tDrop","tButton");
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


//changing theme
function changeTheme(){
    var bt = document.getElementById("theme");
    if (bt.innerHTML == "Dark"){
        bt.innerHTML = "Light";
        bt.className = "btn btn-light";
        
        $('.trashcan').hide();
        $('.trashcan-dark').show();
        $('.countrybtn').toggleClass('btn-light');
        $('.countrybtn').toggleClass('btn-dark');
        
        $('#bar').toggleClass('bg-dark');
        $('#barhome').toggleClass('dark');
        $('#barhis').toggleClass('dark');
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
        
        $('.trashcan').show();
        $('.trashcan-dark').hide();
        $('.countrybtn').toggleClass('btn-light');
        $('.countrybtn').toggleClass('btn-dark');
        
        $('#bar').toggleClass('bg-dark');
        $('#barhome').toggleClass('dark');
        $('#barhis').toggleClass('dark');
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

$(document).ready(function(){
    init("latest");
});