import { put, call } from 'redux-saga/effects'
import LoginActions from '../Redux/LoginRedux'

// attempts to login
export function * login (apiOdoo, action) {
    const { username, password, databaseName, baseURL  } = action
    console.tron.log(databaseName)
    apiOdoo.username = username
    apiOdoo.password = password
    apiOdoo.database = databaseName
    console.tron.log(apiOdoo)
//    apiOdoo.axiosInstance.setBaseURI(baseURL)

    const response = yield call(apiOdoo.login, username, password, databaseName)
    if (response.ok) {

        if (response.data.error) {
            yield put(LoginActions.loginFailure(response.data.error.data.message))
        } else {
            // dispatch successful logins
            //First place where we can manage the server answer
            this.sessionId = response.data.result
            yield put(LoginActions.loginSuccess(response.data.result))
        }
    } else {
        // dispatch failure
        yield put(LoginActions.loginFailure('Something went wrong while trying to reach Odoo Server'))
    }
}

// Only to test attempts to login
// export function * login ({ username, password }) {
//   if (password === '') {
//     // dispatch failure
//     yield put(LoginActions.loginFailure('WRONG'))
//   } else {
//     // dispatch successful logins
//     yield put(LoginActions.loginSuccess(username))
//   }
// }
