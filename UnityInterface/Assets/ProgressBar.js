#pragma strict

private var sr:SpriteRenderer;
public var frames:Sprite[];


function Start(){
	sr = transform.root.GetComponent(SpriteRenderer);
	
}

public function changeState(curValue:float, MaxValue:float){

	var newFrame:int = (curValue/MaxValue)*16;
	//print("frame:"+newFrame);
	sr.sprite = frames[newFrame];
	

}