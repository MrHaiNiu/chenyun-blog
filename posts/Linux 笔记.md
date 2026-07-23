---
title: "Markdown 功能全面测试"
date: "2026-03-25 07:00:00"
description: "测试代码高亮、数学公式、表格、引用等 Markdown 功能"
cover: "https://bu.dusays.com/2026/03/24/69c26fe4acdb5.jpg"
tags: ["笔记", "Markdown", "教程", "Linux"]

---

# Linux 系统管理技术

## 常用 Shell 命令

### 文件系统管理

链接文件（Link File）分为两种：
·软连接（Symbolic Link）：也成为符号链接，其数据内容就是另一个文件的路径，我们称它指向另一个文件，用 l 表示其类型，和 Windows 
·硬链接（Hard Link）：硬链接就是一个文件名，即使用 ln 命令创建，注意：文件夹不支持

> 文件就是存放在磁盘上的一份数据，文件名就是这份数据的一个标签，用于表示这份数据，方便访问。一个文件是可有多个文件名的。这些文件名都称为该文件的硬链接。

普通文件和文件夹通用命令：
·cp：copy，拷贝文件，拷贝文件夹时必须带上参数 -r 参数
·mv：move，移动文件，通常用该命令实现文件重命名操作（在同一个文件夹下移动可以实习重命名）

wget：从网络上下载文件。常用参数： -O 指定下载后的文件名 

### 文件打包和压缩：
文件打包：为了方便管理和传输，将多个文件整合在一起构成一个文件，这个文件就是包文件，后缀名通常为  .tar
文件压缩：使用某个数据压缩算法将一个文件变小，好处是可以减少存储空间占用，提示网络传输效率。压缩文件不能直接使用，需要进行解压缩操作得到原始文件才能使用。
压缩包：将多个文件打包一起得到一个包文件，然后对包文件进行压缩处理后得到最终的压缩包文件。

常用数据压缩算法：
·zip
·gzip
·bzip
·xzip
·rar（闭源，商业化）

文件打包命令：
```shell
# 打包
tar -cvf junge.tar hello.c test.c asdf

# 查包
tar -tvf junge.tar

# 解包
tar -xvf junge.tar  # 默认解压到当前文件夹下，可以通过 -C 解压到指定目录下
```

文件压缩常用命令：
```shell
# gzip 压缩和解压
gzip junge.jpg      # 得到压缩后端的文件 junge.jpg.gz
gunzip junge.jpg.gz # 得到原始文件 junge.jpg

# bzip2 压缩和解压
bzip2 junge.jpg     # 得到压缩后的文件 junge.jpg.bz2 
bunzip2 junge.jpg   # 得到原始文件 junge.jpg

# xz 压缩和解压
xz junge.jpg     # 得到压缩后的文件 junge.jpg.xz
xunz junge.jpg   # 得到原始文件 junge.jpg
```

常见压缩包格式及操作命令：
```shell
# .tar.gz 格式
tar -zcvf junge.tar.gz hello.c mage.jpg longge.mp3    # 打包并压缩

tar -tvf junge.tar.gz                                # 查看压缩包

tar -xvf junge.tar.gz                                # 解压缩，默认解压到当前文件夹下，可以通过 -C 指定解压路径

# .tar.bz2 格式
tar -jcvf junge.tar.bz2 hello.c mage.jpg longge.mp3 # 打包并压缩

tar -tvf junge.tar.bz2                             # 查看压缩包

tar -xvf junge.tar.bz2                            # 解压缩，默认解压到当前文件夹下，可以通过 -C 指定解压路径

# .tar.xz 格式
tar -Jcvf junge.tar.xz hello.c mage.jpg longge.mp3  # 打包并压缩

tar -tvf junge.tar.xz                              # 查看压缩包

tar -xvf junge.tar.xz                             # 解压缩，默认解压到当前文件夹下，可以通过 -C 指定解压路径

# .zip 格式
zip -r junge.zip hello.c mage.jpg longge.mp3     # 打包并压缩

uzip -l junger.zip                             # 查看压缩包

unzip junge.zip                               # 解压缩，默认解压到当前文件夹下，可以通过 -d 指定解压路径
```


文件系统管理命令都支持 文件名通配符，从而可以轻松实现对文件批量操作：
· *   ：表示若干个任意字符 （可以为 0 个），
· ？：表示任意一个字符

## 任务（进程）管理

现代操作系统（比如 Linux，Windows，HarmonyOS）都是多任务系统的操作系统。

一个任务通常就是一个进程（Process），进程就是正在运行的程序（Program），程序就是可执行文件。

> 软件（Software），程序 + 文档
> 硬件（Hardware），PCB 板，芯片，元器件等。