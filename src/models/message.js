"strict mode";

function Message(player, body){
  this.body = body;
  this.player = player;
  this.time = new Date().getTime();
}

Message.prototype = {
  getBody: function(){
    return this.body;
  },
  getSender: function(){
    return this.player;
  },
  getTime: function(){
    return this.time;
  }
};

module.exports = Message;
