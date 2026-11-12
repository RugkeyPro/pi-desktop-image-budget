# 图片预算与局部查看

独立 Pi Desktop 插件，ID `local.image-budget`。

工具：`read_image`、`image_info`、`list_images`（由宿主按插件 ID 命名空间隔离）。
默认最长边 2048px、512KiB；detail=high 最长边4096px、1MiB；crop={x,y,width,height} 按原图坐标裁剪。
原文件不变；无网络权限，文件读取通过宿主 pi.fs。
不拦截或改写其他工具、粘贴附件和既有会话；不自动删除历史图片。
参考 Codex 的预算、缩放提示和按需细节设计，并非复制整个 Codex harness。
安装后重新加载插件，首次使用由宿主确认其文件读取权限。为统一读图入口，可在扩展页关闭旧 Vision Kit。
