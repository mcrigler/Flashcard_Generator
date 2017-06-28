//************************************************//
//*****      Constructor for Cloze Card      *****//
//************************************************//
//
function clozeCard(text,cloze){
	if(this instanceof clozeCard){
		this.text = text;
		this.cloze = cloze;
		this.partial = text.replace(cloze, ".....")
		}
	else {
		return new clozeCard(text,cloze)
		}
};

module.exports = clozeCard;