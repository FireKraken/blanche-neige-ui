 <?php


//  =============  user values ====
$host = "127.0.0.1";  //  <<<<<<<<<<<<<<<<< YOUR CHATSCRIPT SERVER IP ADDRESS GOES HERE 
$port = 10248;     // <<<<<<< your portnumber if different from 1024
$user = "globule";   // <<<<<< your username, or "guest"
$bot  = "";  // <<<<<<< desired botname, or "" for default bot
$null = "\x00";
//=========================
// Note - the top part (PHP) is skipped on the first display of this form, but fires on each loop after that.


    // open client connection to TCP server
    //  echo "<p> Here goes </p>";

    $msg=$_GET['message'];
    $user=$_GET['userID'];
    $message = $user.$null.$bot.$null.$msg.$null;

   // echo "<p>User $user told bot $bot this: </p>";
   // echo '<h2>'.$msg.'</h2>';
  
    // fifth parameter in fsockopen is timeout in seconds
    if(!$fp=fsockopen($host,$port,$errstr,$errno,30)){
        trigger_error('Error opening socket',E_USER_ERROR);
    }
    // echo "<p> made it past fsockopen ok <p>";

    // write message to socket server
    fputs($fp,$message);
    // get server response
    $ret=fgets($fp,$port);
    // close socket connection
    fclose($fp);
    
   //echo "Chatbot $bot replied to $user:";
    echo $ret;
//    exit();

?>


