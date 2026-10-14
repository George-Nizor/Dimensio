"""Three Bézier curves to turn into a rope, a pipe and a rail.

For lesson 81, Curve depth and bevel. Each piece is a plain 3D Bézier curve
with no depth yet, Resolution Preview U 12, so it shows as a thin line:

- "Rope", 3 points, hangs between two posts 3 m apart, its lowest point
  0.45 m below the post tops.
- "Pipe", 4 points, runs 1.3 m along the ground and bends up 1.2 m.
- "Rail", 3 points, a handrail 4 m long and 1 m high with a gentle bend.
- "Rail profile", a closed 4-point poly curve 8 cm wide and 4 cm tall, flat
  in its own XY plane, for the rail's Bevel > Object.

The two posts are in a "Posts" reference collection, which measuring skips.
The default cube is removed; the camera and the light stay. Measuring the
starting file gives no meshes. After the exercise, with the rope, pipe and
rail converted to meshes, it gives 3 meshes.
"""

OPTIONS = {}


def build(starter):
    import bmesh
    import bpy
    from mathutils import Matrix

    scene = starter.scene
    starter.remove_default_cube()

    def bezier(name, points, handles="AUTO", location=(0.0, 0.0, 0.0)):
        data = bpy.data.curves.new(name, type="CURVE")
        data.dimensions = "3D"
        data.resolution_u = 12
        spline = data.splines.new("BEZIER")
        spline.bezier_points.add(len(points) - 1)
        for point, co in zip(spline.bezier_points, points):
            point.co = co
            point.handle_left_type = handles
            point.handle_right_type = handles
        obj = bpy.data.objects.new(name, data)
        obj.location = location
        scene.collection.objects.link(obj)
        return obj

    rope = bezier("Rope", [(-1.5, 0.0, 1.3), (0.0, 0.0, 0.85), (1.5, 0.0, 1.3)], location=(0.0, -2.5, 0.0))

    pipe = bezier("Pipe", [(-1.0, 0.0, 0.15), (0.0, 0.0, 0.15), (0.3, 0.0, 0.45), (0.3, 0.0, 1.35)])
    ends = pipe.data.splines[0].bezier_points
    for point in (ends[0], ends[-1]):
        point.handle_left_type = "VECTOR"
        point.handle_right_type = "VECTOR"

    rail = bezier("Rail", [(-2.0, 0.0, 1.0), (0.0, 0.35, 1.0), (2.0, 0.0, 1.0)], location=(0.0, 2.5, 0.0))

    profile_data = bpy.data.curves.new("Rail profile", type="CURVE")
    profile_data.dimensions = "2D"
    profile = profile_data.splines.new("POLY")
    profile.points.add(3)
    for point, (x, y) in zip(profile.points, [(-0.04, -0.02), (0.04, -0.02), (0.04, 0.02), (-0.04, 0.02)]):
        point.co = (x, y, 0.0, 1.0)
    profile.use_cyclic_u = True
    profile_obj = bpy.data.objects.new("Rail profile", profile_data)
    profile_obj.location = (3.0, 2.5, 0.0)
    scene.collection.objects.link(profile_obj)

    posts = starter.reference_collection("Posts")
    post_mat = starter.material("Post", (0.45, 0.33, 0.22))
    for index, x in enumerate((-1.55, 1.55)):
        bm = bmesh.new()
        bmesh.ops.create_cube(bm, size=1.0, matrix=Matrix.Diagonal((0.12, 0.12, 1.4, 1.0)))
        mesh = bpy.data.meshes.new(f"Post {index + 1}")
        bm.to_mesh(mesh)
        bm.free()
        mesh.materials.append(post_mat)
        post = bpy.data.objects.new(f"Post {index + 1}", mesh)
        post.location = (x, -2.5, 0.7)
        posts.objects.link(post)

    for obj in bpy.data.objects:
        obj.select_set(False)
    starter.frame_viewports((-2.2, -3.0, 0.0), (3.2, 3.0, 1.5))
