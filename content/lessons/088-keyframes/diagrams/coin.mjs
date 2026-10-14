// The coin from this lesson's exercise. Not a diagram itself: a 16-sided cylinder 0.6 m across and
// 0.1 m thick, stood on its edge, turned `spin` degrees about Z and raised `lift` metres.
import { cylinder, rotate, translate } from '../../../diagrams/mesh.mjs';

export const coin = (spin = 0, lift = 0) => translate(rotate(rotate(cylinder({ vertices: 16, radius: 0.3, depth: 0.1 }), 'x', 90), 'z', spin + 20), [0, 0, 0.3 + lift]);
