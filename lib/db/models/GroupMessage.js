class GroupMessage {
  constructor (data) {
    this.text = data.text
    this.senderId = data.senderId
    this.groupId = data.groupId
  }
}

module.exports = GroupMessage
