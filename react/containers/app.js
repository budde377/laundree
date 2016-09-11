/**
 * Created by budde on 28/05/16.
 */

const connect = require('react-redux').connect
const {App} = require('../views')

const mapStateToProps = ({users, currentUser, laundries}, {params: {id}}) => {
  return {
    user: users[currentUser],
    laundries,
    currentLaundry: id
  }
}

module.exports = connect(mapStateToProps)(App)
