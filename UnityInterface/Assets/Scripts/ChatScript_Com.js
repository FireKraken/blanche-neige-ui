#pragma strict

// private var ChatScripUrl= "http://enurai.encs.concordia.ca/chatbot/chatscriptclient.php?";
// private var NewIDUrl= "http://enurai.encs.concordia.ca/chatbot/chatscriptid.php?";
private var ChatScripUrl= "http://127.0.0.1/chatscriptclient.php?";
private var NewIDUrl= "http://127.0.0.1/chatscriptid.php?";
private var userID = "globule";
private var userNumber:int = 0;
private var userInput : String = "[Type or dictate your answer here]";
private var userText : String = "Hello young lady";
private var botOutput : String = null;
private var consoleText : String;
private var scrollPosition : Vector2 = Vector2.zero;
private var showLog : boolean = false;

// Text bubble variables

public var textDelay = 0.2;
private var botWords : String = "Testing, testing, one two, one two";
private var botCurrentWords : String = "";
private var playerWords : String = "Testing, testing, one two, one two";
private var playerCurrentWords : String = "";

// Flags

private var botTalking : boolean = false;
private var playerTalking : boolean = false;


// GUI

var inputBoxCoords : Rect;
var inputBoxStyle : GUIStyle;
var textBubbleStyle : GUIStyle;
var textBubbleStyle2 : GUIStyle;
var textBubbleCoords : Rect;
var userBubbleCoords : Rect;
var buttonStyle : GUIStyle;
var restartButtonCoords : Rect;
var trustLabelCoords : Rect;
var patienceLabelCoords : Rect;
var labelStyle : GUIStyle;

public var TrustBar : ProgressBar;
public var PatienceBar : ProgressBar;

//Game variables
var session : int = 0;
var trust : int = 0;
var maxTrust : int = 3;
var patience : int = 6;
var maxPatience : int = 6;

// Game objects
var BlancheNeige : Transform;

// private var timeStamp : System.DateTime;
// private var currentTime : String = null;


function Start ()
{
	getNewID ();
	initConversation ();
}


function botSays (bubbletext : String)
{

    bubbletext = bubbletext.Replace ("\r", "");
    bubbletext = bubbletext.Replace ("\n", "");
    bubbletext = parseCodes (bubbletext);
	while (playerTalking == true || botTalking == true)
	{
		yield WaitForSeconds (0.1);
	}
	
    botTalking = true;

    botWords = bubbletext;
	botCurrentWords = "";
	

    for (var letter in bubbletext.ToCharArray ())
    {
        if (botCurrentWords == bubbletext) break;
        if (botWords != bubbletext) break;
        botCurrentWords += letter;
        yield WaitForSeconds (textDelay * Random.Range (0.01, 0.5)); // Original Random.Range(0.5, 2)
    } 
    
    botTalking = false;

}

function playerSays (bubbletext:String)
{

	while (playerTalking == true || botTalking == true)
	{
		yield WaitForSeconds (0.1);
	}
    playerTalking = true;
    bubbletext = bubbletext.Replace ("\r", "");
    bubbletext = bubbletext.Replace ("\n", "");
    bubbletext = parseCodes (bubbletext);
    playerWords = bubbletext;
	playerCurrentWords = "";


    for (var letter in bubbletext.ToCharArray ())
    {

        if (playerCurrentWords == bubbletext) break;
        if (playerWords != bubbletext) break;
        playerCurrentWords += letter;
        yield WaitForSeconds (textDelay * Random.Range (0.01, 0.5)); // Original Random.Range(0.5, 2)
    } 
    playerTalking = false;

}
  
function parseCodes(parseText:String) : String
{

// trust ++
	if (parseText.Contains ("CTplus"))
	{
		trust++;
		parseText = parseText.Replace("CTplus", "");		
		TrustBar.GetComponent(ProgressBar).changeState(trust,maxTrust);
		BlancheNeige.GetComponent(Animator).SetInteger("trust",trust);
	}
// trust --
	if (parseText.Contains ("CTminus"))
	{
		trust--;
		parseText = parseText.Replace("CTminus", "");		
		TrustBar.GetComponent(ProgressBar).changeState(trust,maxTrust);
		BlancheNeige.GetComponent(Animator).SetInteger("trust",trust);
	}	
// end
	if (parseText.Contains ("CFail"))
	{
		trust=-1;
		parseText = parseText.Replace("CFail", "");		
		TrustBar.GetComponent(ProgressBar).changeState(0,maxTrust);
		BlancheNeige.GetComponent(Animator).SetInteger("trust",trust);
		//print("fail");
	}	
// end
	if (parseText.Contains ("CPatience"))
	{
		patience--;
		parseText = parseText.Replace("CPatience", "");		
		PatienceBar.GetComponent(ProgressBar).changeState(patience,maxPatience);
	}		
// win
	if (parseText.Contains ("CWin"))
	{
		parseText = parseText.Replace("CWin", "");		
	}	
// gambit
	if (parseText.Contains ("CGambit"))
	{
		parseText = parseText.Replace ("CGambit", "");	
		playerWords = playerCurrentWords + "- [Snow White curtly interrupts you]";
		playerCurrentWords = playerWords;
		print("CGambit:"+playerCurrentWords);
		// playerSays (playerWords);
	}
	
	return parseText;

}
 


function OnGUI ()
{

	if (Event.current.type == EventType.KeyDown && (Event.current.keyCode == KeyCode.Return || Event.current.keyCode == KeyCode.Return))
	{
		consoleText = consoleText + "\n[You] said: " + userInput;
        postMessage (userInput);
        playerSays (userInput);
        userInput = "";
	}

	GUI.skin.label.alignment = TextAnchor.MiddleCenter; // Text alignment
	
	// 	User text bubble		
    var textwidth : float = userBubbleCoords.width * Screen.width / 1280;
    var bubbleheight : float = textBubbleStyle2.CalcHeight (GUIContent (playerWords), textwidth);
    var minWidth : float;
    var maxWidth : float;
    textBubbleStyle.CalcMinMaxWidth (GUIContent (playerWords), minWidth,  maxWidth);
    if (maxWidth > textwidth)
    {
    	maxWidth = textwidth;
    }  
    if (maxWidth < 100)
    	maxWidth = 100; 
    GUI.color.a = playerCurrentWords.Length;
    GUI.color.a /= 8;  
    if (playerCurrentWords == playerWords)
    	GUI.color.a = 1;
    GUI.Box (Rect (userBubbleCoords.x * Screen.width / 1280 + textwidth - maxWidth, userBubbleCoords.y * Screen.height / 800, maxWidth, bubbleheight), playerCurrentWords, textBubbleStyle2);
    GUI.color.a = 1.0;
    
    // Bot text bubble
    
    textwidth = textBubbleCoords.width * Screen.width / 1280;
    bubbleheight = textBubbleStyle.CalcHeight (GUIContent (botWords), textwidth);
	textBubbleStyle.CalcMinMaxWidth (GUIContent (botWords), minWidth,  maxWidth);
    if (maxWidth > textwidth)
    {
    	maxWidth = textwidth;
    }    
    if (maxWidth < 100)
    	maxWidth = 100;
    // print (botCurrentWords.Length);
    GUI.color.a = botCurrentWords.Length;
    GUI.color.a /= 8;
    if (botCurrentWords == botWords)
    	GUI.color.a = 1;
    GUI.Box (Rect (textBubbleCoords.x * Screen.width / 1280, textBubbleCoords.y * Screen.height / 800, maxWidth, bubbleheight), botCurrentWords, textBubbleStyle);
    GUI.color.a = 1.0;
    
    if (showLog) // Manages log window elements
	{
		GUILayout.Label ("Log", GUILayout.Width (550));
			
		scrollPosition = GUILayout.BeginScrollView (scrollPosition, GUILayout.Width (575), GUILayout.Height (175));			
		GUILayout.Box (consoleText, GUILayout.Width (550)); // Post console text to the log.		
		GUILayout.EndScrollView ();
					
	}

	
	// Text box for user input
	if ((Event.current.type == EventType.MouseUp)&& (GUI.GetNameOfFocusedControl() == "inputbox") && (userInput == "[Type or dictate your answer here]"))
	{
			userInput = "";
	}		
	GUI.SetNextControlName ("inputbox");
	
	// Disables the text field while Snow White is talking
	GUI.enabled = !botTalking;
	userInput = GUI.TextField (Rect(inputBoxCoords.x*Screen.width/1280,inputBoxCoords.y*Screen.height/800,inputBoxCoords.width*Screen.width/1280,inputBoxCoords.height*Screen.height/800), userInput, inputBoxStyle);
	GUI.enabled = true;
	// If the max string length is limited (say, to 250), a phantom line-break is introduced into the text field. There does not seem to be a way to fix this.
		
/*	if(GUILayout.Button("Log"))
	{
		showLog = !showLog; // Toggles log visibility
	}*/
	
	//Restart Button
	if (GUI.Button (Rect (restartButtonCoords.x * Screen.width / 1280, restartButtonCoords.y * Screen.height / 800, restartButtonCoords.width * Screen.width / 1280, restartButtonCoords.height * Screen.height / 800 ), "[RESTART]", buttonStyle))
	{

		initConversation ();
		// Application.LoadLevel(0); // Application.LoadLevel("test"); // Alternatively, replace the scene's index number with the name of the scene
	}
	
	// Progress Bars
	GUI.Label (Rect (trustLabelCoords.x * Screen.width / 1280, trustLabelCoords.y * Screen.height / 800, trustLabelCoords.width * Screen.width / 1280, trustLabelCoords.height * Screen.height / 800 ), "TRUST", labelStyle);
	GUI.Label (Rect (patienceLabelCoords.x * Screen.width / 1280, patienceLabelCoords.y * Screen.height / 800, patienceLabelCoords.width * Screen.width / 1280, patienceLabelCoords.height*Screen.height / 800 ), "PATIENCE", labelStyle);

}

function initConversation ()
{
	
	while (userNumber == 0)
	{
		yield WaitForSeconds (0.1);
	}
	
	session++;
	userID = "id_" + userNumber + "_session_" + session;
	print (userID);
	trust = 0;
	patience = 6;
	playerSays ("Hello young lady.");
	postMessage ("");
	PatienceBar.GetComponent (ProgressBar).changeState (patience,maxPatience);
	TrustBar.GetComponent (ProgressBar).changeState (trust,maxTrust);
}

function getNewID ()
{
    var w = WWW (NewIDUrl);
    yield w;
    userNumber = int.Parse (w.text);
    print ("userNumber:" + userNumber);
}

/*function getTrust () 
{

    var msgURL = ChatScripUrl + "message=" + WWW.EscapeURL ("simon say give me variable " + variable) + "&userID=" + WWW.EscapeURL (userID);
    print (msgURL);
    var w = WWW (msgURL);
    yield w;
    return w.text;
}*/




function postMessage (message : String)
{

    var msgURL = ChatScripUrl + "message=" + WWW.EscapeURL (message) + "&userID=" + WWW.EscapeURL (userID);
    print (msgURL);
    var w = WWW (msgURL);
    yield w;
    if (!String.IsNullOrEmpty (w.error))
    {
       botOutput = "You'll have to be connected to the Internet to talk to me, Old Woman.";
       botSays (botOutput);
    }
    else 
    {
    	consoleText = consoleText+"\n[Snow White] said: "+w.text;
    	scrollPosition.y = Mathf.Infinity; 
    	botOutput = w.text; // Retrieve bot response for display in text bubble
		botSays (botOutput);
	}
    
     /* // Recording time stamps for bot replies
    timeStamp = System.DateTime.Now;
	currentTime = String.Format("{0:D2}:{1:D2}:{2:D2}", timeStamp.Hour, timeStamp.Minute, timeStamp.Second);
		
	consoleText = consoleText+"\n["+currentTime+"] Snow White said: "+w.text;
	*/
}