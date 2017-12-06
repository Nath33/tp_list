const { courseList } = require('../../data/db')

function uuid(){
    var dt = new Date().getTime();
    let uuid = 'xxxxx-xxx-xxx-xxxxx'.replace(/[x]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}

mockData = [
  { id: uuid(), name: 'Toto' },
  { id: uuid(), name: 'Ma liste' }
]

module.exports = {
  up: () => {
    courseList.splice(0)
    courseList.push.apply(courseList, mockData)
  },

  down: () => {
    courseList.splice(0)
  }
}
