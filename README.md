Realtime and Interactive Voxels
================

**Early Stage** voxel rendering engine for R. Currently you can manualy
create and nagivate through voxels worlds using R. Soon to come,
suppoort to create and retrieve voxels from R.

## Installation

Install the package as follows:

``` r
install.packages("remotes")
remotes::install_github("javierluraschi/voxels")
```

## Getting Started

You can easily launch a voxel explorer and editor,

``` r
library(voxels)
voxels()
```

![](tools/README/voxels-demo.gif)

Notice that after closing the explorer, `voxels()` returns a matrix of
voxels which you can pass in `voxels()` to render back those voxels, or
alternatevely, you can pass your own 3D matrix to render voxels from it:

``` r
voxels(array(c(
    0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1,
    0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1,
    0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1,
    0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1,
    0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1,
    1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
), dim=c(19, 5, 2)), offset = c(-10, 0, 0))
```

![](tools/README/voxels-hello.png)
