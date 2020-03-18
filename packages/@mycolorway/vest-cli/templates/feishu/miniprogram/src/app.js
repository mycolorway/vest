import { tt } from '@mycolorway/vest-core'

App({
  onLaunch() {
    this.checkUpdate()
  },

  checkUpdate() {
    const updateManager = tt.getUpdateManager()
    if (updateManager) {
      updateManager.onCheckForUpdate(res => {
        if (res.hasUpdate) {
          tt.showLoading({
            title: '正在下载新版本',
            mask: true
          })
        }
      })

      updateManager.onUpdateReady(() => {
        updateManager.applyUpdate()
      })

      updateManager.onUpdateFailed(() => {
        tt.hideLoading()
        tt.showModal({
          title: '新版本下载失败',
          content: '请检查你的网络状况，然后重启小程序。',
          showCancel: false
        })
      })
    }
  }
})
