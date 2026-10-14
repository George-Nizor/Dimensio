"""Three blocks to stack and five posts to set out, for practising snapping.

For lesson 12, Snapping.

- "Ground" is a strip 10 m long and 1 m wide, from X 0 to X 10 along the X
  axis, centred on Y 0, lying on the grid at Z 0. It cannot be selected.
- "Block 1" is a 1 m cube standing on the grid beside the strip, its corners
  on whole metres (X -4 to -3, Y -2 to -1). "Block 2" and "Block 3" are the
  same cube floating at odd heights to its left and behind it. Stacked corner
  to corner with vertex snapping, Block 2's centre ends at Z 1.5 and Block 3's
  at Z 2.5 above Block 1.
- "Post 1" to "Post 5" are posts 0.2 by 0.2 by 1.2 m standing on the grid
  behind the strip, at positions that are not whole metres. Their origins
  are at the bottom centre, so snapping the origin to the grid or to the 3D
  cursor stands a post on the ground. Set out along the strip 2 m apart, the
  posts' origins are at X 0, 2, 4, 6 and 8, Y 0.

The default cube is removed; the camera and the light stay. Nothing is
selected. Measuring gives 9 meshes (the strip, three blocks and five posts),
98 triangles and no n-gons. The exercise has no measure: limits.
"""

OPTIONS = {}

BLOCKS = [(-3.5, -1.5, 0.5), (-6.2, 1.3, 0.87), (-1.7, 2.9, 1.42)]
POSTS = [(1.15, 3.35), (2.6, 2.2), (4.85, 3.7), (6.3, 2.45), (8.7, 3.1)]


def build(starter):
    import bmesh
    import bpy
    from mathutils import Matrix

    scene = starter.scene
    starter.remove_default_cube()

    def mesh(name, matrix):
        bm = bmesh.new()
        bmesh.ops.create_cube(bm, size=1.0, matrix=matrix)
        data = bpy.data.meshes.new(name)
        bm.to_mesh(data)
        bm.free()
        return data

    ground_mesh = bpy.data.meshes.new("Ground")
    bm = bmesh.new()
    bmesh.ops.create_grid(bm, x_segments=1, y_segments=1, size=0.5,
                          matrix=Matrix.Translation((5.0, 0.0, 0.0)) @ Matrix.Diagonal((10.0, 1.0, 1.0, 1.0)))
    bm.to_mesh(ground_mesh)
    bm.free()
    ground_mesh.materials.append(starter.material("Ground", (0.42, 0.50, 0.32)))
    ground = bpy.data.objects.new("Ground", ground_mesh)
    scene.collection.objects.link(ground)
    ground.hide_select = True

    block_mat = starter.material("Block", (0.80, 0.55, 0.30))
    block_mesh = mesh("Block", Matrix.Identity(4))
    block_mesh.materials.append(block_mat)
    objects = [ground]
    for number, location in enumerate(BLOCKS, start=1):
        block = bpy.data.objects.new(f"Block {number}", block_mesh)
        block.location = location
        scene.collection.objects.link(block)
        objects.append(block)

    post_mesh = mesh("Post", Matrix.Translation((0.0, 0.0, 0.6)) @ Matrix.Diagonal((0.2, 0.2, 1.2, 1.0)))
    post_mesh.materials.append(starter.material("Post", (0.55, 0.40, 0.25)))
    for number, (x, y) in enumerate(POSTS, start=1):
        post = bpy.data.objects.new(f"Post {number}", post_mesh)
        post.location = (x, y, 0.0)
        scene.collection.objects.link(post)
        objects.append(post)

    for obj in scene.objects:
        obj.select_set(False)
    low, high = starter.world_bounds(objects)
    starter.frame_viewports(low, high)
