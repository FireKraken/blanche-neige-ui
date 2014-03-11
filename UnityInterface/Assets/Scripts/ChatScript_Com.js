#pragma strict

// private var ChatScripUrl= "http://enurai.encs.concordia.ca/chatbot/chatscriptclient.php?";
// private var NewIDUrl= "http://enurai.encs.concordia.ca/chatbot/chatscriptid.php?";
private var ChatScripUrl= "http://127.0.0.1/chatscriptclient.php?";
private var NewIDUrl= "http://127.0.0.1/chatscriptid.php?";
private var userID = "globule";
private var userInput : String = "[Type or dictate your answer here]";
private var userText : String = "Hello young lady";
private var botOutput : String = null;
private var consoleText : String;
private var scrollPosition : Vector2 = Vector2.zero;
private var showLog : boolean = false;

public var textDelay = 0.2;
private var words : String = "Testing, testing, one two, one two";
private var currentWords : String;

//GUI
var inputBoxCoords:Rect;
var inputBoxStyle:GUIStyle;
var textBubbleStyle:GUIStyle;
var textBubbleStyle2:GUIStyle;
var textBubbleCoords:Rect;
var userBubbleCoords:Rect;
var buttonStyle:GUIStyle;
var restartButtonCoords:Rect;

//Game variables
var trust:int = 0;

//game objects
var BlancheNeige:Transform;

// private var timeStamp : System.DateTime;
// private var currentTime : String = null;

function Start ()
{
	yield getNewID();
	postMessage("");
}

function AddText(newText : String)
{
    words = newText;
    words = words.Replace("\r","");
    words = words.Replace("\n","");
    parseCodes();
    TypeText(words);

}
 
function parseCodes(){

//trust ++
	if(words.Contains("CTplus")){
		trust++;
		words = words.Replace("CTplus","");
		print("more trust");
		BlancheNeige.position.x += 1; 
		
	}

}
 
private function TypeText (compareWords : String) 
{
	currentWords = null;

    for (var letter in compareWords.ToCharArray())
    {
        if (words != compareWords) break;
        currentWords += letter;
        // yield WaitForSeconds(textDelay);
        yield WaitForSeconds(textDelay * Random.Range(0.01, 0.5)); // Original Random.Range(0.5, 2)
    }  
 
}

function OnGUI()
{

	if (Event.current.type == EventType.KeyDown && (Event.current.keyCode == KeyCode.Return || Event.current.keyCode == KeyCode.Return))
	{
		/* // Recording timestamps for user inputs
		timeStamp = System.DateTime.Now;
		currentTime = String.Format("{0:D2}:{1:D2}:{2:D2}", timeStamp.Hour, timeStamp.Minute, timeStamp.Second);
		
		consoleText = consoleText+"\n["+currentTime+"] You said: "+userInput;
		*/
		
		consoleText = consoleText+"\n[You] said: "+userInput;
        postMessage(userInput);
        userText = userInput;
        userInput = "";
	}

				
	GUI.skin.box.wordWrap = true; // Set the wordwrap on for box only.
	GUI.skin.box.alignment = TextAnchor.MiddleLeft; // Text alignment for boxes
	GUI.skin.label.alignment = TextAnchor.MiddleCenter; // Text alignment
	
	// 	User text bubble		
    var textwidth:float = userBubbleCoords.width*Screen.width/1280;
    var bubbleheight:float = textBubbleStyle2.CalcHeight(GUIContent(userText),textwidth);
    var minWidth:float;
    var maxWidth:float;
    textBubbleStyle.CalcMinMaxWidth(GUIContent(userText), minWidth,  maxWidth);
    if(maxWidth>textwidth){
    	maxWidth=textwidth;
    }  
    if(maxWidth<100){maxWidth=100;}    
    GUI.Box(Rect(userBubbleCoords.x*Screen.width/1280+textwidth-maxWidth,userBubbleCoords.y*Screen.height/800,maxWidth,bubbleheight),userText, textBubbleStyle2);
    
    // Bot text bubble
    
    textwidth = textBubbleCoords.width*Screen.width/1280;
    bubbleheight = textBubbleStyle.CalcHeight(GUIContent(words),textwidth);
	textBubbleStyle.CalcMinMaxWidth(GUIContent(words), minWidth,  maxWidth);
    if(maxWidth>textwidth){
    	maxWidth=textwidth;
    }    
    if(maxWidth<100){maxWidth=100;}
    GUI.Box(Rect(textBubbleCoords.x*Screen.width/1280,textBubbleCoords.y*Screen.height/800,maxWidth,bubbleheight),currentWords, textBubbleStyle);
    
    
    if(showLog) // Manages log window elements
	{
		GUILayout.Label("Log", GUILayout.Width(550));
			
		scrollPosition = GUILayout.BeginScrollView(scrollPosition, GUILayout.Width(575), GUILayout.Height(175));			
		GUILayout.Box(consoleText, GUILayout.Width(550)); // Post console text to the log.		
		GUILayout.EndScrollView ();
					
	}

	
	// Text box for user input
	if((Event.current.type == EventType.MouseUp)&& (GUI.GetNameOfFocusedControl() == "inputbox") && (userInput == "[Type or dictate your answer here]")){
			userInput = "";
	}		
	GUI.SetNextControlName ("inputbox");
	userInput = GUI.TextField(Rect(inputBoxCoords.x*Screen.width/1280,inputBoxCoords.y*Screen.height/800,inputBoxCoords.width*Screen.width/1280,inputBoxCoords.height*Screen.height/800),userInput, inputBoxStyle);
		
	//if ((Event.current.button == 1) && (GUI.GetNameOfFocusedControl() == "inputbox") && (userInput == "[Type or dictate your answer here]")){

	
/*	if(GUILayout.Button("Log"))
	{
		showLog = !showLog; // Toggles log visibility
	}*/
	if(GUI.Button(Rect(restartButtonCoords.x*Screen.width/1280,restartButtonCoords.y*Screen.height/800, restartButtonCoords.width*Screen.width/1280,restartButtonCoords.height*Screen.height/800 ),"[RESTART]",buttonStyle))
	{
		/* // For some reason posts garbled text from the server when spamming the [RESTART] button
		getNewID();
		postMessage("");
		userText = "Hello young lady";*/
		
		Application.LoadLevel(0); // Application.LoadLevel("test"); // Alternative, replace the scene's index number with the name of the scene
	}
	/*if(GUILayout.Button("Rebuild")){
		postMessage(":build 1");
		userText = null;
	}
	*/	

}

function Update ()
{
	
}

function getNewID()
{
    var w = WWW(NewIDUrl);
    yield w;	
    userID = w.text;
    print(userID);
}
/*function getTrust() {

    var msgURL = ChatScripUrl+"message="+WWW.EscapeURL("simon say give me variable "+variable)+"&userID="+WWW.EscapeURL(userID);
    print(msgURL);
    var w = WWW(msgURL);
    yield w;
    return w.text;
}*/




function postMessage(message:String)
{

    var msgURL = ChatScripUrl+"message="+WWW.EscapeURL(message)+"&userID="+WWW.EscapeURL(userID);
    print(msgURL);
    var w = WWW(msgURL);
    yield w;
    if (!String.IsNullOrEmpty(w.error)){
       botOutput = "You'll have to be connected to the Internet to talk to me, Old Woman.";
       AddText("\n\n"+botOutput);
     }
    else {
    	consoleText = consoleText+"\n[Snow White] said: "+w.text;
    	scrollPosition.y = Mathf.Infinity; 
    	botOutput = w.text; // Retrieve bot response for display in text bubble
		AddText("\n\n"+botOutput);
	}
    
     /* // Recording time stamps for bot replies
    timeStamp = System.DateTime.Now;
	currentTime = String.Format("{0:D2}:{1:D2}:{2:D2}", timeStamp.Hour, timeStamp.Minute, timeStamp.Second);
		
	consoleText = consoleText+"\n["+currentTime+"] Snow White said: "+w.text;
	*/
}