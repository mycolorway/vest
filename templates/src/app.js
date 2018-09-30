import wxAPI from '@/modules/wx_api'

App({
  onLaunch() {
    this.checkUpdate()
  },

  checkUpdate() {
    const updateManager = wxAPI('getUpdateManager')
    if (updateManager) {
      updateManager.onCheckForUpdate(res => {
        if (res.hasUpdate) {
          wxAPI('showLoading', {
            title: '正在下载新版本',
            mask: true
          })
        }
      })

      updateManager.onUpdateReady(() => {
        updateManager.applyUpdate()
      })

      updateManager.onUpdateFailed(() => {
        wxAPI('hideLoading')
        wxAPI('showModal', {
          title: '新版本下载失败',
          content: '请检查你的网络状况，然后重启小程序。',
          showCancel: false
        })
      })
    }
  }
})
