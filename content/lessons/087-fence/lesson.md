---
needs: [bezier-curves, instancing]
exercise: fence-generator
watch: [danene3d-fence, blender-manual-geometry-nodes-curve-to-mesh]
sources:
  - Blender 5.2 Manual, "Resample Curve Node", Length mode (https://docs.blender.org/manual/en/5.2/modeling/geometry_nodes/curve/operations/resample_curve.html), read 2026-10-15
  - Blender 5.2 Manual, "Instance on Points Node", working on curve control points (https://docs.blender.org/manual/en/5.2/modeling/geometry_nodes/instances/instance_on_points.html), read 2026-10-15
  - Blender 5.2 Manual, "Object Info Node", Original transform space (https://docs.blender.org/manual/en/5.2/modeling/geometry_nodes/input/scene/object_info.html), read 2026-10-15
  - Blender 5.2 Manual, "Curve to Mesh Node", Profile Curve and Fill Caps (https://docs.blender.org/manual/en/5.2/modeling/geometry_nodes/curve/operations/curve_to_mesh.html), read 2026-10-15
  - Blender 5.2 Manual, "Quadrilateral Node" (https://docs.blender.org/manual/en/5.2/modeling/geometry_nodes/curve/primitives/quadrilateral.html), read 2026-10-15
  - Blender 5.2 Manual, "Node Groups", new inputs from the hollow socket and renaming them in the Group panel (https://docs.blender.org/manual/en/5.2/interface/controls/nodes/groups.html), read 2026-10-15
  - Blender 5.2 Manual, "Realize Instances Node" (https://docs.blender.org/manual/en/5.2/modeling/geometry_nodes/instances/realize_instances.html), read 2026-10-15
  - Blender 5.2 Manual, "Convert", Mesh (https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/convert.html), read 2026-10-15
  - 'Blender 5.2.2, checked 2026-10-15 in a script: this node tree on an 8.5 m curve gives 6, 9 and 5 posts at Spacing 1.5, 1 and 2 m with a post at each end; a new group input starts at 0; Curve to Mesh with this Quadrilateral stands the rail upright on a flat curve; the converted fence is one mesh with no n-gons and no doubled vertices, 160 triangles at Spacing 1.5 m'
---

# A fence generator

A fence is the same post and rail over and over, which makes it a good job for Geometry Nodes. In this project you'll build one node group that puts posts and rails along any curve you draw, with the spacing on the modifier. Then you'll use it on two paths and take one into Godot.

![A wooden fence following a curved path: posts every 1.5 m and two rails running between them.](example)

## Steps

1. **Start from a curve and a post.** Draw the fence's path with Add > Curve > Bézier. Model a post 1 m tall with its origin at its base. Give the curve a Geometry Nodes modifier and rename its node group Fence.

2. **Space points along it.** Drop Resample Curve (Curve > Operations) on the link and set Mode to Length. Drag its Length socket to Group Input's hollow socket. Rename the input Spacing in the Sidebar's Group tab. On the modifier, set it to 1.5 m.

   ![Group Input's Spacing linked into Resample Curve's Length, in Length mode, beside a curved path with points spaced evenly along it, one at each end.](resample)

3. **Stand a post on each point.** Add Object Info (Input > Scene) and pick your post. Link its Geometry into Instance on Points, and link Resample Curve into Points. Instance on Points works on a curve's points as well as a mesh's.

   ![Resample Curve into Instance on Points' Points, and Object Info with the Post into Instance, beside a row of posts standing along the path.](posts)

4. **Run the rails.** Add Curve to Mesh fed by Resample Curve. Give it a Quadrilateral (Curve > Primitives) 0.04 by 0.1 m as its Profile Curve and tick Fill Caps. Two Transform Geometry nodes lift copies of the rail to 0.4 m and 0.8 m.

   ![A Quadrilateral 0.04 by 0.1 m as the Profile Curve of Curve to Mesh, with Fill Caps ticked, and two Transform Geometry nodes at Z 0.4 m and 0.8 m.](rails)

5. **Join and realize.** Link the posts and both rails into Join Geometry, then add Realize Instances before Group Output. Draw a second curve, add a Geometry Nodes modifier and pick Fence from its node group list. It gets a fence too.

   ![Instance on Points and the two rail Transform nodes into Join Geometry, then Realize Instances, then Group Output.](join)

6. **Convert and export.** Select one fence and choose Object > Convert > Mesh. Export it with File > Export > glTF 2.0 (.glb/.gltf) as in lesson 35, and place it in your Godot scene along the path it was drawn for.

## Common mistake

![Seen from the front. Left, posts with their origin in the middle, sunk halfway below the curve. Right, posts with their origin at the base, standing on it.](mistake)

Object Info places a post by its origin. Model the post with its origin in its middle, as a new cube has, and half of every post sinks below the path. Set the post's origin to its base before you build the fence.

## Checking your model

Look at the fence from the front view, `Numpad 1`, and check:

1. A post stands at each end of the path, and the rest are evenly spaced.
2. Both rails run through every post.
3. Changing Spacing on the modifier moves the posts and the rails follow.
4. The converted fence is one mesh under 2,000 triangles.
