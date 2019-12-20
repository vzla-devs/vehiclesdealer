import { RootState } from '@/store/interfaces/rootState'
import { Getter } from '@/store/getters/types'

export default {
  [Getter.AVAILABLE_VEHICLES]: function (state: RootState): any {
    return state.vehicles
  }
}
