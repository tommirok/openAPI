const faker = require("faker");


const mockTopics = function() {
  let arr = []
  for (let index = 0; index < 100; index++) {
    arr.push(faker.hacker.ingverb())
    
  }
  return arr;
}
const mockCities = () => {
  let arr = []
  for (let index = 0; index < 100; index++) {
    arr.push(faker.address.city())
    
  }
  return arr;
}
const mockDeadlines = () => {
  let arr = []
  for (let index = 0; index < 100; index++) {
    arr.push(faker.date.future())
    
  }
  return arr;
}


module.exports = {
  cities: mockCities,
  topics: mockTopics,
  deadlines: mockDeadlines,
}