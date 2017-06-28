//************************************************//
//*****      Constructor for Basic Card      *****//
//************************************************//
//

function basicCard(front,back){
if(this instanceof basicCard){
	this.front = front;
	this.back = back;
	}
else {
	return new basicCard(front,back);
	}
};

module.exports = basicCard;

