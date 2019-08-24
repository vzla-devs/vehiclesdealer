import Actions from '@/store/actions/messagesActions'
import { SHOW_MESSAGE, CLEAR_MESSAGE } from '@/store/actions/actionTypes'
import { SET_MESSAGE, RESET_MESSAGE } from '@/store/mutations/mutationTypes'
import { MESSAGE_TYPES } from '@/constants/enums'

describe('messagesActions.js', () => {
  let context

  beforeEach(() => {
    context = { 'commit': jest.fn() }
  })

  test('should commit the corresponding mutation to show an error message', () => {
    const payload = {
      type: MESSAGE_TYPES.ERROR,
      message: 'anyMessage'
    }

    Actions[SHOW_MESSAGE](context, payload)

    expect(context.commit).toHaveBeenCalledWith(SET_MESSAGE, payload)
  })

  test('should commit the corresponding mutation to clear an error message', () => {
    const type = MESSAGE_TYPES.ERROR

    Actions[CLEAR_MESSAGE](context, type)

    expect(context.commit).toHaveBeenCalledWith(RESET_MESSAGE, type)
  })
})
