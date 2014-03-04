#pragma strict

// private var ChatScripUrl= "http://enurai.encs.concordia.ca/chatbot/chatscriptclient.php?";
// private var NewIDUrl= "http://enurai.encs.concordia.ca/chatbot/chatscriptid.php?";
private var ChatScripUrl= "http://127.0.0.1/chatscriptclient.php?";
private var NewIDUrl= "http://127.0.0.1/chatscriptid.php?";
private var userID = "globule";
private var userInput : String = "[Type/dictate your answer]";
private var userText : String = null;
private var botOutput : String = null;
private var consoleText : String;
private var scrollPosition : Vector2 = Vector2.zero;
private var showLog : boolean = false;

public var userTarget : Transform; // attach User_TextBoxTarget here
public var botTarget : Transform; // attach Bot_TextBoxTarget here
private var userBubble = Rect(0,0,500,100);
private var botBubble = Rect(0,0,500,100);
private var offset =  Vector2(0, 1.5); // height above the target position

public var textDelay = 0.2;
private var words : String = "Testing, testing, one two, one two";
private var currentWords : String;

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
    TypeText(words);
}
 
private function TypeText (compareWords : String) 
{
	currentWords = null;

    for (var letter in compareWords.ToCharArray())
    {
        if(letter==13) break;
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
	GUILayout.BeginArea(Rect (Screen.width *0.1, Screen.height *0.1, Screen.width *0.8, Screen.height *0.8));	
	
	GUILayout.BeginVertical();
				
		GUI.skin.box.wordWrap = true; // Set the wordwrap on for box only.
		GUI.skin.box.alignment = TextAnchor.MiddleLeft; // Text alignment for boxes
		GUI.skin.label.alignment = TextAnchor.MiddleCenter; // Text alignment
		
		// 	User text bubble		
		var userPoint = Camera.main.WorldToScreenPoint(userTarget.position);
	    userBubble.x = userPoint.x;
	    userBubble.y = userPoint.y;
	    GUI.Box(userBubble, userText);
	    
	    // Bot text bubble
	    var botPoint = Camera.main.WorldToScreenPoint(botTarget.position);
	    botBubble.x = botPoint.x;
	    botBubble.y = botPoint.y;
	    GUI.Box(botBubble, currentWords);
	    
	    GUILayout.FlexibleSpace();
	    
	    if(showLog) // Manages log window elements
		{
			GUILayout.Label("Log", GUILayout.Width(550));
				
			scrollPosition = GUILayout.BeginScrollView(scrollPosition, GUILayout.Width(575), GUILayout.Height(175));			
			GUILayout.Box(consoleText, GUILayout.Width(550)); // Post console text to the log.		
			GUILayout.EndScrollView ();
						
		}
		
		GUILayout.FlexibleSpace();
		
		// Text box for user input
		userInput = GUILayout.TextField(userInput);
				
		// Horizontal field for "Log", "Reset" and "Rebuild" buttons
		GUILayout.BeginHorizontal();
		
			if(GUILayout.Button("Log"))
			{
				showLog = !showLog; // Toggles log visibility
			}
			if(GUILayout.Button("Reset"))
			{
				getNewID();
				postMessage("");
				userText = null;
			}
			if(GUILayout.Button("Rebuild")){
				postMessage(":build 1");
				userText = null;
			}
			
		GUILayout.EndHorizontal();
		
	GUILayout.EndVertical();
	
	GUILayout.EndArea();
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

function postMessage(message:String)
{

    var msgURL = ChatScripUrl+"message="+WWW.EscapeURL(message)+"&userID="+WWW.EscapeURL(userID);
    print(msgURL);
    var w = WWW(msgURL);
    yield w;
    consoleText = consoleText+"\n[Snow White] said: "+w.text;
    scrollPosition.y = Mathf.Infinity;
    
    botOutput = w.text; // Retrieve bot response for display in text bubble
	AddText("\n\n"+botOutput);
    
     /* // Recording time stamps for bot replies
    timeStamp = System.DateTime.Now;
	currentTime = String.Format("{0:D2}:{1:D2}:{2:D2}", timeStamp.Hour, timeStamp.Minute, timeStamp.Second);
		
	consoleText = consoleText+"\n["+currentTime+"] Snow White said: "+w.text;
	*/
}