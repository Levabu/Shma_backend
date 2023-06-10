class PrivateMessage {
  constructor (data) {
    this.text = data.text
    this.senderId = data.senderId
    this.recipientId = data.recipientId
  }
}

module.exports = PrivateMessage
