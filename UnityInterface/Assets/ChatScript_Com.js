#pragma strict

private var ChatScripUrl= "http://127.0.0.1/chatscriptclient.php?";
private var userInput : String = "Hello young woman";
private var consoleText:String = "Last thing said";
private var scrollPosition:Vector2;

function Start () {

}

function OnGUI(){


	if (Event.current.type == EventType.KeyDown && (Event.current.keyCode == KeyCode.Return || Event.current.keyCode == KeyCode.Return)){
		consoleText = consoleText+"\n"+userInput;
        postMessage(userInput);
        userInput = "";	
	
	}
	GUILayout.BeginArea(Rect (Screen.width *0.1, Screen.height *0.1, Screen.width *0.8, Screen.height *0.8));	
	GUILayout.BeginVertical();
		scrollPosition = Vector2(0,1000000);
		GUILayout.BeginScrollView (scrollPosition);
		GUI.skin.box.wordWrap = true; // set the wordwrap on for box only.
		GUILayout.Box(consoleText); // just your message as parameter.
		GUILayout.EndScrollView ();
		userInput = GUILayout.TextField ( userInput);
		if(GUILayout.Button("Reset"))
		{
			 postMessage(":reset");
		}
		if(GUILayout.Button("Rebuild")){
			postMessage(":build 1");
		}
	GUILayout.EndVertical();
	GUILayout.EndArea();



}

function Update () {



}

function postMessage(message:String){

    var msgURL = ChatScripUrl+"message="+WWW.EscapeURL(message);
    print(msgURL);
    var w = WWW(msgURL);
    yield w;	
    consoleText = consoleText+"\n"+ w.text;

}