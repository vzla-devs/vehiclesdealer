
import { VehiclesClient } from '@/clients/clientsFactory'
import { Action } from './types'
import { Mutation } from '@/store/mutations/types'
import { ErrorMessage } from '@/store/models/errorMessage'

export default {
  [Action.GET_VEHICLES]: async ({ commit, dispatch }) => {
    commit(Mutation.SET_APPLICATION_LOADING, true)
    try {
      const response = await VehiclesClient.get()
      commit(Mutation.SET_VEHICLES, response.data)
    } catch (error) {
      const errorMessage = new ErrorMessage('ha ocurrido un error')
      dispatch(Action.SHOW_MESSAGE, errorMessage)
    }
    commit(Mutation.SET_APPLICATION_LOADING, false)
  }
}
