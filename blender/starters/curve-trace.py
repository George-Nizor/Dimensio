"""Two flat shapes on the ground to trace with Bézier curves, seen from the top.

For lesson 80, Bézier curves. In a "Trace" reference collection, lying flat
just above the ground and seen from the top view (Numpad 7, orthographic):

- "Road": a strip 1 m wide whose middle line runs about 13 m in an S-bend:
  a long gentle bend, a straight, then a tighter bend the other way. Tracing
  its middle line takes four or five control points.
- "Hook": a band 0.15 m wide in the shape of a J, 3.3 m tall, to the right
  of the road: a straight shaft that turns through a half circle into
  a short tip. The shaft is straight and meets the bend without a corner, so
  its top point wants a Vector handle and the rest can stay Automatic.

Measuring skips the collection, and its objects cannot be selected or
rendered, so the learner's curves are drawn over them without picking them by
mistake. The default cube is removed; the camera and the light stay. The file
opens in the top view, framed on both shapes. Measuring the starting file
gives 0 meshes. The exercise makes curves and has no measure: limits.
"""

import math

OPTIONS = {}


def build(starter):
    import bmesh
    import bpy
    from mathutils import Quaternion, Vector

    scene = starter.scene
    starter.remove_default_cube()
    collection = starter.reference_collection("Trace")

    def bezier(p0, p1, p2, p3, steps):
        out = []
        for i in range(steps + 1):
            t = i / steps
            u = 1 - t
            out.append(p0 * u ** 3 + p1 * 3 * u * u * t + p2 * 3 * u * t * t + p3 * t ** 3)
        return out

    def band(name, points, width, material):
        """A flat strip `width` wide along a polyline of 2D points."""
        bm = bmesh.new()
        left, right = [], []
        for i, p in enumerate(points):
            a = points[max(i - 1, 0)]
            b = points[min(i + 1, len(points) - 1)]
            d = (b - a).normalized()
            n = Vector((-d.y, d.x))
            left.append(bm.verts.new((*(p + n * width / 2), 0.002)))
            right.append(bm.verts.new((*(p - n * width / 2), 0.002)))
        for i in range(len(points) - 1):
            bm.faces.new((right[i], right[i + 1], left[i + 1], left[i]))
        mesh = bpy.data.meshes.new(name)
        bm.to_mesh(mesh)
        bm.free()
        mesh.materials.append(material)
        obj = bpy.data.objects.new(name, mesh)
        collection.objects.link(obj)
        return obj

    road_mat = starter.material("Road", (0.18, 0.18, 0.2))
    hook_mat = starter.material("Hook", (0.75, 0.35, 0.1))

    # The road: two cubic segments joined smoothly, then a straight.
    v = Vector
    road = bezier(v((-9.0, -5.0)), v((-9.0, -1.0)), v((-6.5, 0.5)), v((-4.0, 0.5)), 24)
    road += bezier(v((-4.0, 0.5)), v((-3.0, 0.5)), v((-2.0, 0.5)), v((-1.0, 0.5)), 4)[1:]
    road += bezier(v((-1.0, 0.5)), v((1.0, 0.5)), v((1.0, 3.5)), v((-0.5, 4.5)), 20)[1:]
    road_obj = band("Road", road, 1.0, road_mat)

    # The hook: a shaft, a half circle and a short tip.
    hook = [v((3.0, 4.0 - 0.25 * i)) for i in range(11)]  # from y 4.0 down to 1.5
    centre = v((3.8, 1.5))
    for i in range(1, 33):
        a = math.pi + math.pi * i / 32  # from the left of the circle, under it, to its right
        hook.append(centre + v((math.cos(a), math.sin(a))) * 0.8)
    hook += [v((4.6, 1.5 + 0.125 * i)) for i in range(1, 5)]
    hook_obj = band("Hook", hook, 0.15, hook_mat)

    low, high = starter.world_bounds([road_obj, hook_obj])
    starter.frame_viewports(low, high)
    top = Quaternion((1.0, 0.0, 0.0, 0.0))
    for screen in bpy.data.screens:
        for area in screen.areas:
            if area.type != "VIEW_3D":
                continue
            for space in area.spaces:
                if space.type == "VIEW_3D" and space.region_3d is not None:
                    space.region_3d.view_rotation = top
                    space.region_3d.view_perspective = "ORTHO"
