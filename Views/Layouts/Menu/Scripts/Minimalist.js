// @ts-nocheck
/* @Creado por: Tania Maldonado
 * @Fecha: Enero 2020
 * @Tipo: Controla el menu
 */


window.history.forward(1);
var MenuListNodes = document.getElementsByClassName('MenuList');
//MenuSelected    = document.getElementById('MenuSelected'),
//BackgroundsNodes = '';
var ImagesUrl = ServerSource + 'Media/Menu/',
    FormatDate = '',
    FormatHour = '',
    MenuList = '',
    MenuIndex = 0,
    ActiveChromeCast = false,
    HDMIS           = [],
    IndexM = null;

function SetMenuList() {
    MenuList = null;
    $.ajax({
        type: 'POST',
        cache: false,
        url: ServerSource + 'Core/Controllers/Menu.php',
        data: {
            Option: 'GetModules',
            ProjectId: '1'
            //ProjectId: Device['Services']['ProjectId']
        },
        success: function (response) {

            getSourceInfo();
            getPropValueArray();
            // MenuList = $.parseJSON(response);
            // console.log(MenuList);
            // SetMenuInfo();
            setTimeout(function(){
                MenuList = $.parseJSON(response);
                var checkMack = b2bcontrol.getMACAddress();

                // if(checkMack === '80:47:86:14:81:7b'){
                    for(var i =0; i < HDMIS.length; i++){
                        MenuList.push({id: null, Name: HDMIS[i][1]+" "+HDMIS[i][0], Url: null, Image: null, Description: "HDMI"});
                    }
                // }
                SetMenuInfo();
            },1000);
        }
    });


}
SetMenuList();
GetWeather();
//SetMenuInfo()

function SetMenuInfo() {
    ((MenuIndex - 1) >= 0) ? MenuListNodes[0].textContent = MenuList[MenuIndex - 1].Name : MenuListNodes[0].textContent = MenuList[MenuList.length - 1].Name;
    MenuListNodes[1].textContent = MenuList[MenuIndex].Name;
    ((MenuIndex + 1) <= (MenuList.length - 1)) ? MenuListNodes[2].textContent = MenuList[MenuIndex + 1].Name : MenuListNodes[2].textContent = MenuList[0].Name;
}
/*******************************************************************************
* MOVIMIENTOS FLECHAS EPG
*******************************************************************************/

function MenuOk() {
    // if (MenuList[MenuIndex].Url !== 'menu.php') {
    //     //Page, ModuleId, ChangeModule
    //     GoPage(MenuList[MenuIndex].Url, MenuList[MenuIndex].Id, MenuList[MenuIndex].Name);
    // }
    if(MenuList[MenuIndex].Description != "HDMI"){
        if(MenuList[MenuIndex].Url !== 'menu.php'){
            //Page, ModuleId, ChangeModule
            GoPage(MenuList[MenuIndex].Url, MenuList[MenuIndex].Id, MenuList[MenuIndex].Name);
        }
    }else{
        launchSource(MenuList[MenuIndex].Description);
        ActiveChromeCast = true;
    }
}

function MenuRight() {
    //MenuSelect('RIGHT');
    // MenuIndex++;
    // if (MenuIndex > MenuList.length - 1) {
    //     MenuIndex = 0;
    // }
    // SetMenuInfo();
    if(ActiveChromeCast == false){
        MenuIndex++;
        if(MenuIndex > MenuList.length - 1){
            MenuIndex = 0;
        }
        SetMenuInfo();
    }
}

function MenuLeft() {
    //MenuSelect('LEFT');
    // MenuIndex--;
    // if (MenuIndex < 0) {
    //     MenuIndex = MenuList.length - 1;
    // }
    // SetMenuInfo();
    if(ActiveChromeCast == false){
        MenuIndex--;
        if(MenuIndex < 0){
            MenuIndex = MenuList.length - 1;
        }
        SetMenuInfo();
    }
}

function MenuDown() {

}

function MenuUp() {

}

function MenuBack(){
    if(ActiveChromeCast == true){
        hideSource();
        ActiveChromeCast = false;
    }
}


var getSourceInfo = function() {
	try {
	     var source = tizen.tvwindow.getSource();
	     console.log("type = " + source.type);
	     console.log("number = " + source.number);
	     //$("#get_source_info").html("Current source type is " + source.type + " source number is " + source.number);
	 } catch (error) {
		 //$("#get_source_info").html("error occured while getting source info " + "Error name = "+ error.name + ", Error message = " + error.message);
	     console.log("Error name = "+ error.name + ", Error message = " + error.message);
	 }
};

var getPropValueArray = function() {
    var sourceArray = ["VIDEOSOURCE"];
    var connectedSources;
    function success1CB(videoSource) {
        connectedSources = videoSource.connected;
        for (var i = 0; i < connectedSources.length; i++) {
            console.log("--------------- Source " + i + " ---------------");
            console.log("type = " + connectedSources[i].type);
            console.log("number = " + connectedSources[i].number);
            if(connectedSources[i].type == "HDMI")
                HDMIS.push([connectedSources[i].number,connectedSources[i].type, connectedSources[i].name]);
        }
    }
   
    function error1CB(error) {
        console.log("getPropertyValue() is failed. Error name = "+ error.name + ", Error message = " + error.message);
    }
    
    for(var a = 0; a < sourceArray.length; a++) {
        console.log("sources " + sourceArray[a]);
        tizen.systeminfo.getPropertyValue(sourceArray[a], success1CB, error1CB);
    }
};

var launchSource = function(sourceName) {
	
	var connectedVideoSources;
    function successCB(source, type) {
        // alert("setSource() is successfully done. source name = " + source.name + ", source port number = " + source.number);
        showSource();
    }

    function errorCB(error) {
        console.log("setSource() is failed. Error name = "+ error.name + ", Error message = " + error.message);
    }

    function systemInfoSuccessCB(videoSource) {
        connectedVideoSources = videoSource.connected;
        for (var i = 0; i < connectedVideoSources.length; i++) {
            console.log("--------------- Source " + i + " ---------------");
            console.log("type = " + connectedVideoSources[i].type);
            console.log("number = " + connectedVideoSources[i].number);
            if (connectedVideoSources[i].type === sourceName) {
                // set HDMI as input source of TV hole window
                tizen.tvwindow.setSource(connectedVideoSources[i], successCB, errorCB);
                getSourceInfo();
                break;
            }
        }
    }

	 function systemInfoErrorCB(error) {
	     console.log("getPropertyValue(VIDEOSOURCE) is failed. Error name = "+ error.name + ", Error message = " + error.message);
	 }

	 try {
	     tizen.systeminfo.getPropertyValue("VIDEOSOURCE", systemInfoSuccessCB, systemInfoErrorCB);
	 } catch (error) {
	     console.log("Error name = "+ error.name + ", Error message = " + error.message);
	 }
};

var hideSource = function() {
	function successCallBack() {
		handleBack();
	};
	function errorCallBack() {
		handleBack();
	};
	tizen.tvwindow.hide(successCallBack, errorCallBack, "MAIN");
};

var showSource = function() {
	function successCB(windowRect, type) {
	      // You will get exactly what you put as rectangle argument of show() through windowRect.
	      // expected result : ["0", "0px", "50%", "540px"]
	      console.log("Rectangle : [" + windowRect[0] + ", " + windowRect[1] + ", " + windowRect[2] + ", " + windowRect[3] + "]");
	  }

	  try {
	      tizen.tvwindow.show(successCB, null, ["0", "0", "100%", "100%"], "MAIN");
	  } catch(error) {
	      console.log("error: " + error.name);
	  } 
};