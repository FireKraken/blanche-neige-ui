 <?php


//  =============  user values ====
$counterfilename = "counter.txt";
$counterfile = fopen($counterfilename, "r");

if( $counterfile == false )
{
   echo ( "Error in opening file" );
   exit();
}

$counterfilesize = filesize( $counterfilename );
$countervalue =  fread( $counterfile, $counterfilesize );
$countervalue++;

echo ($countervalue);

fclose( $counterfile );

$counterfile = fopen($counterfilename, "w");
fwrite( $counterfile, $countervalue );
fclose( $counterfile );

?>


