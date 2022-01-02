import {LatLng, LatLngBounds} from "leaflet";


export function joinDots(list_dots: Array<LatLng>, boundary: LatLngBounds, max_dots: number): [Array<LatLng>, Array<number>] {

    // filter dots (must be inside the boundaries)
    const list_dots_inside = list_dots.filter((dot) => boundary.contains(dot))
    const n_init_dots = list_dots_inside.length
    const list_n_dots = new Array(n_init_dots).fill(1);

    let n_dots = n_init_dots
    while (n_dots > max_dots) {
        let min_distance = Math.pow(10, 1000);  // infinity
        let dot1_mem, dot2_mem;
        let index1_mem, index2_mem;
        dot1_mem = dot2_mem= new LatLng(0, 0);
        index1_mem = index2_mem = 0;
        list_dots_inside.forEach(
            (dot1, index1) => {
                list_dots_inside.forEach(
                    (dot2, index2) => {
                        let distance = dot1.distanceTo(dot2);
                        if (distance < min_distance) {
                            min_distance = distance;
                            dot1_mem = dot1;
                            dot2_mem = dot2;
                            index1_mem = index1;
                            index2_mem = index2;
                        }
                    }
                )
            }
        )
        // fuse dot1_mem & dot2_mem
        let new_dot = new LatLng((dot1_mem.lat + dot2_mem.lat) / 2, (dot1_mem.lng + dot2_mem.lng) / 2);
        let new_n_dots = list_n_dots[index1_mem] + list_n_dots[index2_mem];

        // remove old dots.
        list_dots_inside.splice(index1_mem, index1_mem + 1);
        list_dots_inside.splice(index2_mem, index2_mem + 1);

        // remove old dots n dots
        list_n_dots.splice(index1_mem, index1_mem + 1);
        list_n_dots.splice(index2_mem, index2_mem + 1);

        // add new dot
        list_dots_inside.push(new_dot);
        list_n_dots.push(new_n_dots);

        n_dots--;
    }

    return [list_dots_inside, list_n_dots];
}