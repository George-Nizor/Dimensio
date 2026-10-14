---
needs: [fields]
exercise: scatter-the-hill
watch: [blender-guru-donut-part-7, joey-carlino-instances]
sources:
  - Blender 5.2 Manual, "Instances" (https://docs.blender.org/manual/en/5.2/modeling/geometry_nodes/instances.html), read 2026-10-15
  - Blender 5.2 Manual, "Distribute Points on Faces", Density and Seed (https://docs.blender.org/manual/en/5.2/modeling/geometry_nodes/point/distribute_points_on_faces.html), read 2026-10-15
  - Blender 5.2 Manual, "Instance on Points Node", Pick Instance, Rotation, Scale (https://docs.blender.org/manual/en/5.2/modeling/geometry_nodes/instances/instance_on_points.html), read 2026-10-15
  - Blender 5.2 Manual, "Collection Info Node", dragging a collection in, Separate Children, Reset Children (https://docs.blender.org/manual/en/5.2/modeling/geometry_nodes/input/scene/collection_info.html), read 2026-10-15
  - Blender 5.2 Manual, "Random Value Node" (https://docs.blender.org/manual/en/5.2/modeling/geometry_nodes/utilities/random_value.html), read 2026-10-15
  - Blender 5.2 Manual, "Realize Instances Node" (https://docs.blender.org/manual/en/5.2/modeling/geometry_nodes/instances/realize_instances.html), read 2026-10-15
  - Blender 5.2 Manual, "Scatter on Surface Modifier" (https://docs.blender.org/manual/en/5.2/modeling/modifiers/generate/scatter_on_surface.html), read 2026-10-15
  - 'Blender 5.2.2, checked 2026-10-15 in a script on the scatter-hill starter: the tree in this lesson gives 2,132 triangles at Density 0.4 with Realize Instances and the hill joined back, and 512, the hill alone, when the copies stay instances; Scatter on Surface has Align Rotation on and Randomize off by default, and its Randomize Rotation is shown in degrees'
---

# Instancing on points

Geometry Nodes can spread hundreds of copies of an object over a surface and rearrange them when you change one number. In this lesson you'll scatter points over a hill and put a rock or a tree on each, with a random turn and size. Then you'll make the copies real so Dimensio can measure them.

![A low-poly hill covered in scattered rocks and trees, each turned its own way and a little bigger or smaller than its neighbours.](example)

## Steps

1. **Scatter points.** Give the Hill a Geometry Nodes modifier and drop Distribute Points on Faces (the Point menu) on the link. Density is the number of points per square metre: start at 0.4. Change Seed to get another pattern.

   ![Distribute Points on Faces linked from Group Input, with Density 0.4 and Seed 0, beside the hill covered in orange points.](distribute)

2. **Put the props on the points.** Add Instance on Points (Instances) after it. Drag the Props collection from the Outliner into the node editor to make a Collection Info node. Link it into Instance. Each copy is an instance, sharing one mesh with the original.

3. **Mix the props.** On Collection Info, tick Separate Children and Reset Children. On Instance on Points, tick Pick Instance. Each point now gets either the rock or the tree instead of both.

   ![Collection Info with Props, Separate Children and Reset Children ticked, linked into Instance on Points with Pick Instance ticked.](instance)

4. **Vary them.** Add two Random Value nodes (Utilities). Set one to Vector with Max Z 6.283, a full turn in radians, and link it into Rotation. Set the other to Float from 0.7 to 1.3 and link it into Scale.

   ![A Vector Random Value from 0 to 6.283 on Z linked into Rotation, and a Float Random Value from 0.7 to 1.3 linked into Scale.](random)

5. **Make them real.** Add Realize Instances after Instance on Points, then a Join Geometry that also takes Group Input, so the hill stays. Realized copies become part of the hill's mesh, which is what Dimensio measures.

   ![Instance on Points into Realize Instances, then into Join Geometry together with Group Input, then Group Output.](realize)

6. **Or use Scatter on Surface.** Add Modifier > Generate > Scatter on Surface does the same in one modifier. Choose the collection, tick Realize Instances and Pick Instance, and turn Randomize on. Untick Align Rotation, or the trees lean with the slope.

   ![The Scatter on Surface panel: Density 0.4, Instance Type Collection, Props, Realize Instances and Pick Instance ticked, Align Rotation off, Randomize on.](modifier)

## Common mistake

![Seen from the top. Left, with Reset Children off, every rock and tree lands 9 m beside its point, off the hill. Right, with it on, each stands on its point.](mistake)

The rock and the tree stand 9 m from the world origin, beside the hill. Collection Info keeps that offset, so every copy lands 9 m from its point. Tick Reset Children and each copy stands right on its point.

## Checking your model

Look at the hill in Object Mode and check:

1. Rocks and trees stand on the hill, not beside it.
2. Each copy faces its own way, and their sizes vary.
3. Realize Instances sits between Instance on Points and Join Geometry.
4. The whole scene is under 20,000 triangles.
