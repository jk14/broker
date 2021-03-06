const path = require('path')
const { expect, rewire, sinon } = require('test/test-helper')

const getTradeHistory = rewire(path.resolve(__dirname, 'get-trade-history'))

describe('getTradeHistory', () => {
  let blockOrderWorker
  let orders
  let fills

  beforeEach(() => {
    orders = [
      {
        orderId: 'orderId',
        status: 'COMPLETED'
      },
      {
        orderId: 'orderId2',
        status: 'EXECUTING'
      }
    ]

    fills = [
      {
        fillId: 'fillId',
        status: 'FILLED'
      },
      {
        fillId: 'fillId2',
        status: 'EXECUTED'
      }
    ]

    blockOrderWorker = {
      getTrades: sinon.stub().resolves({
        orders,
        fills
      })
    }
  })

  it('throws an Error if retreiving trades fails', () => {
    blockOrderWorker.getTrades.rejects(new Error('error'))

    return expect(getTradeHistory({ blockOrderWorker })).to.eventually.be.rejectedWith(Error, 'error')
  })

  it('retrieves the trades', async () => {
    await getTradeHistory({ blockOrderWorker })

    expect(blockOrderWorker.getTrades).to.have.been.calledOnce()
  })

  it('returns trades', async () => {
    const res = await getTradeHistory({ blockOrderWorker })

    expect(res).to.be.eql({
      orders,
      fills
    })
  })
})
