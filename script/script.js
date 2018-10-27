var rates = [];
var totalcountries;
var histtotalcountries;
var basecountrylist = ["USD","HKD"];
var targetcountrylist = ["USD","HKD"];
var basecalc = ["USD","HKD"];
var tarcalc = ["USD","HKD"];
var commonlist = ["USD","HKD","JPY","EUR","CAD"];
var deletedcolumn = [];
var histrates = [];
var storedDate;
var storedMonth;

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
;    for (var i = 0;i < totalcountries;i++){
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
function setDropDownList(id, orient){
    var span = document.getElementById(id);
    for(var i = 0;i < totalcountries;i++){
        var temp = document.createElement("a");
        var image = "<img class='flag' alt='' src='https://www.countryflags.io/"+ rates[i].code + "/flat/32.png'>";
        if(rates[i].code == "BTC"){
            image = "<img class='flag' src='images/BTC.png'>";
        }
        temp.id = i;
        temp.innerHTML = image + rates[i].country;
        temp.onclick = listClicked; 
        temp.setAttribute("country",rates[i].country);
        
        span.appendChild(temp);
    }
}
// dropdown button
function dropDownClicked(id) {
    document.getElementById(id).classList.toggle("show");
}
// dropdown list clicked
function listClicked(){
    console.log(this.id); 
    document.getElementById(this.parentNode.parentNode.id).classList.toggle("show");
    if(this.parentNode.parentNode.id == "bDrop")
        addBase(this.id);
    else 
        addTarget(this.id);
    showResult();
}
// dropdown search function
function filterFunction(dropdowndivID,inputID) {
    var input, filter, ul, li, a, i;
    input = document.getElementById(inputID);
    filter = input.value.toUpperCase();
    div = document.getElementById(dropdowndivID);
    a = div.getElementsByTagName("a");
    for (i = 0; i < a.length; i++) {
        if (a[i].getAttribute("country").toUpperCase().indexOf(filter) > -1) {
            a[i].style.display = "";
        } else {
            a[i].style.display = "none";
        }
    }
}
// dropdown cancel button
function cancelClicked(id){
    document.getElementById(id).classList.toggle("show");
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
function addBase(id){
    var flag = false;
    for (var i = 0;i < basecountrylist.length;i++){
        if(basecountrylist[i] == rates[id].country){
            flag = true;            
            toggleAlert();
            return;
        }
    }
    if(!flag){
        var temp = document.createElement("td");
        temp.className = "basecountry";
        temp.id = basecalc.length + rates[id].country;
        document.getElementById("baserow").appendChild(temp);
        
        var bn = document.createElement("button");
        bn.type = "button";
        if(document.getElementById("theme").innerHTML == "Dark")
            bn.className = "countrybtn btn btn-light";
        else
            bn.className = "countrybtn btn btn-dark";
        bn.onclick = function(){hideColumn(this)};
        temp.appendChild(bn);
        
        var span1 = document.createElement("span");
        span1.className = "hide";
        bn.appendChild(span1);
        
        var countryflag = document.createElement("img");
        countryflag.src = "https://www.countryflags.io/" + rates[id].code + "/flat/32.png";
        countryflag.alt = "";
        span1.appendChild(countryflag);
        
        bn.innerHTML += "  " + rates[id].country;
        
        var span2 = document.createElement("span");
        span2.className = "hide";
        bn.appendChild(span2);
        
        var can = document.createElement("img");
        can.src = "images/delete.png";
        can.className = "trashcan";
        if(document.getElementById("theme").innerHTML == "Dark")
            can.style.display = "initial";
        else
            can.style.display = "none";
        var canDark = document.createElement("img");
        canDark.src = "images/delete_dark.png";
        canDark.className = "trashcan-dark";
        if(document.getElementById("theme").innerHTML == "Dark")
            canDark.style.display = "none";
        else
            canDark.style.display = "initial";
        span2.appendChild(can);
        span2.appendChild(canDark);
        
        
        for(var i = 0;i < tarcalc.length;i++){
            var t = document.createElement("td");
            t.id = i+"r"+basecalc.length;
            t.className = "value";
            var r = document.getElementById("r" + i);
            if(r != null){
                r.appendChild(t);
            }
        }
        
        basecountrylist.push(rates[id].country);
        basecalc.push(rates[id].country);
    }
}

function addTarget(id){
    var flag = false;
    for (var i = 0;i < targetcountrylist.length;i++){
        if(targetcountrylist[i] == rates[id].country){
            flag = true;
            toggleAlert();
            return;
        }
    }
    if(!flag){
        var newRow = document.createElement("tr");
        newRow.id = "r" + tarcalc.length;
        document.getElementById("table").appendChild(newRow);
        
        var temp = document.createElement("td");
        temp.className = "targetcountry";
        temp.id = "r" + rates[id].country;
        newRow.appendChild(temp);
        
        var bn = document.createElement("button");
        bn.type = "button";
        if(document.getElementById("theme").innerHTML == "Dark")
            bn.className = "countrybtn btn btn-light";
        else
            bn.className = "countrybtn btn btn-dark";
        bn.onclick = function(){hideRow(this)};
        temp.appendChild(bn);
        
        var span1 = document.createElement("span");
        span1.className = "hide";
        bn.appendChild(span1);
        
        var countryflag = document.createElement("img");
        countryflag.src = "https://www.countryflags.io/" + rates[id].code + "/flat/32.png";
        countryflag.alt = "";
        span1.appendChild(countryflag);
        
        bn.innerHTML += "  " + rates[id].country;
        
        var span2 = document.createElement("span");
        span2.className = "hide";
        bn.appendChild(span2);
        
        var can = document.createElement("img");
        can.src = "images/delete.png";
        can.className = "trashcan";
        if(document.getElementById("theme").innerHTML == "Dark")
            can.style.display = "initial";
        else
            can.style.display = "none";
        var canDark = document.createElement("img");
        canDark.src = "images/delete_dark.png";
        canDark.className = "trashcan-dark";
        if(document.getElementById("theme").innerHTML == "Dark")
            canDark.style.display = "none";
        else
            canDark.style.display = "initial";
        span2.appendChild(can);
        span2.appendChild(canDark);
        
        for (var i = 0;i < basecalc.length;i++){
            var t = document.createElement("td");
            t.id = tarcalc.length+"r"+i;
            t.className = "value";
            if(deletedcolumn.indexOf(i.toString()) == -1)
                newRow.appendChild(t);
        }
        targetcountrylist.push(rates[id].country);
        tarcalc.push(rates[id].country);
        
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
    var baseicon = "<img alt='' src='https://www.countryflags.io/" + bCountry.substring(0,2) + "/flat/32.png'/>";
    var taricon = "<img alt='' src='https://www.countryflags.io/" + tCountry.substring(0,2) + "/flat/32.png'/>";
    document.getElementById("histresult").innerHTML = baseicon + "<span id='histbaseindicate'>  " + bCountry + "1  = </span>" + taricon + " " + tCountry + " " + r;
    
}
// Show Calculated result
function showResult(){
    //target
    for(var i = 0;i < tarcalc.length;i++){
        //base
        for(var j = 0;j < basecalc.length;j++){
            var temp = document.getElementById(i+"r"+j);
            if(temp != null){
                temp.innerHTML = calRate(basecalc[j],tarcalc[i]);
                console.log(temp.id);
            }
        }
    }   
    
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
//delete row
function hideRow(btn){
    console.log(btn.parentNode.parentNode.id);
    var ele = document.getElementById(btn.parentNode.parentNode.id);
    ele.parentNode.removeChild(ele);
    var temp = btn.parentNode.id.substring(1,4);
    targetcountrylist.splice( targetcountrylist.indexOf(temp),1);
}
//delete column
function hideColumn(btn){
    var c = btn.parentNode.id.substring(1,4);
    var col = btn.parentNode.id.substring(0,1);
    for(var i = 0;i < tarcalc.length;i++){
        var cell = document.getElementById(i+"r"+col);
        var row = document.getElementById("r"+i);
        if(row != null)
            if(cell != null)
                row.removeChild(cell);
    }
    document.getElementById("baserow").removeChild(btn.parentNode);
    deletedcolumn.push(col);
    basecountrylist.splice( basecountrylist.indexOf(c),1);
}

//initialize function
function init(temp){
    loadJSON(function(response){
        var p = JSON.parse(response);
        var date = $('#date-input').val();
        if(temp == "latest"){
            var d = new Date();
            var mon = d.getMonth();
            var date = d.getDate();
            storedMonth = localStorage.getItem("month");
            storedDate = localStorage.getItem("date");
            if(mon == storedMonth && date == storedDate){
                rates = JSON.parse(localStorage.getItem('rate'));
                totalcountries = localStorage.getItem('total');
                console.log("load cache");
                if(rates == null)
                    getData(p.key,"latest");
                setDropDownList("bList","base");
                setDropDownList("tList","target");
                showResult();
                //console.log(rates[0].rate);
            }
            else{
                localStorage.setItem("month",mon);
                localStorage.setItem("date",date);
                getData(p.key,"latest");
            }
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
    var url = "https://data.fixer.io/api/" + date + "?access_key=" + key + "&format=1";
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
            localStorage['rate'] = JSON.stringify(rates);
            localStorage['total'] = totalcountries;
            console.log(JSON.parse(localStorage.getItem('rate')));
            setDropDownList("bList","base");
            setDropDownList("tList","target");
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
        $('#tInput').toggleClass('dark');
        $('#bInput').toggleClass('dark');
        $('.list').toggleClass('dark');
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
        $('#tInput').toggleClass('dark');
        $('#bInput').toggleClass('dark');
        $('.list').toggleClass('dark');
    }
    console.log("clicked");
}

//Alert function
function toggleAlert(){    
    var temp = "<div class='alert alert-warning alert-dismissible' id='warning'><a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a><strong>Warning!</strong> You have already added this currency.</div>"
    document.getElementById("alert-holder").innerHTML = temp;
}

$(document).ready(function(){    
    init("latest");
    
    //mouse event function
    $('#table:has(td)').mouseover(function(e){
        var cell = $(e.target).closest("td");
        if(isNaN(cell.text()) == false){
            console.log(cell.attr('id'));
            var b = parseInt(cell.attr('id').split('r')[1]);
            var t = parseInt(cell.attr('id').split('r')[0]);
            var bCountry = basecalc[b];
            var tCountry = tarcalc[t];
            var html = bCountry + " " + $('#amount').val() + " = <span id='black'>" + tCountry + " " + cell.text() + "</span>"; 
            $("#showHover").html(html);
        }
    });
    
    $('#table:has(td)').mouseout(function(){
        $("#showHover").html("");
    });
});