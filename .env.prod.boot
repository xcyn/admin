# 生成环境
#指定构建模式
NODE_ENV = 'production'

# 标记当前构建方式
ENV = 'prod.boot'

# 此项为jenkins打包需要修改的内容如果修改请明确知会，谢谢
#基础路径 注意:发布之前如果不是根目录需先修改这里,并开启。默认是'/'(根目录)
VUE_APP_PUBLIC_PATH  = '/ibps3/'

# ========base api======================
VUE_APP_BASE_API = 'http://192.168.3.230:5400'
VUE_APP_BASE_WEBSOCKET_API = 'ws://192.168.3.230:5888'

# ========report api======================
VUE_APP_BASE_REPORT_API = 'http://192.168.3.190:8080/raqsoft'
