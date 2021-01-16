import THREE from "three";

// Three.js Viz Functions

// Intensity Coloring
const baseGreen = new THREE.Color(0x00ff00);
const baseRed = new THREE.Color(0xff0000);
const interColor = new THREE.Color();

export const colorData = (percentage) => {
  interColor.copy(baseGreen).lerpHSL(baseRed, percentage * 0.125);
  let colors = [];
  for (let i = 0; i < 24; i++) {
    interColor.toArray(colors, i * 3);
  }
  return new Float32Array(colors);
};

// Projection Mapping
export const longLatToSphere = (long, lat, radius) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (long + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
};

export const createThreeJSON = (usgsData, i) => {
  const centerVector = new THREE.Vector3(0, 0, 0);
  const cubeMat = new THREE.MeshBasicMaterial({
    vertexColors: THREE.VertexColors,
  });
  const cubes = [];
  const quakeArr = [];

  // Data Parsing
  for (const feature of usgsData) {
    // Quake Obj
    const { mag, place, time } = feature.properties;
    const { coordinates } = feature.geometry;
    const quake = {
      magnitude: mag,
      location: place,
      time,
      coordinates,
    };
    // Three Data Obj
    const quakeVector = longLatToSphere(coordinates[0], coordinates[1], 600);
    const { x, y, z } = quakeVector;
    const rgb = colorData(mag);
    const cubeHeight = mag > 0 ? mag ** 3 * 1.75 : 0;
    const cubeGeom = new THREE.BoxBufferGeometry(3, 3, cubeHeight, 1, 1, 1);
    const cube = new THREE.Mesh(cubeGeom, cubeMat);
    //
    cubeGeom.addAttribute("color", new THREE.BufferAttribute(rgb, 3));
    cube.position.set(x, y, z);
    cube.lookAt(centerVector);
    cube.updateMatrix();
    cube.geometry.applyMatrix(cube.matrix);
    cubes.push(cube);
    quakeArr.push(quake);
  }

  // create a new mesh, containing all the other meshes.
  const geom = BufferGeometryUtils.mergeBufferGeometries(
    cubes.map((c) => c.geometry)
  );
  const combined = new THREE.Mesh(geom, cubeMat);
  combined.name = `data${i}`;

  // Data Sorting by Highest Magnitude
  quakeArr.sort((a, b) => b.magnitude - a.magnitude);
  // Store in Global
  return { quakes: quakeArr, threeData: combined.toJSON() };
};

////////////////////////////////
///// THREE BUFFER UTILITY /////
////////////////////////////////

export const BufferGeometryUtils = {
  computeTangents: function (geometry) {
    var index = geometry.index;
    var attributes = geometry.attributes;

    // based on http://www.terathon.com/code/tangent.html
    // (per vertex tangents)

    if (
      index === null ||
      attributes.position === undefined ||
      attributes.normal === undefined ||
      attributes.uv === undefined
    ) {
      console.warn(
        "THREE.BufferGeometry: Missing required attributes (index, position, normal or uv) in BufferGeometry.computeTangents()"
      );
      return;
    }

    var indices = index.array;
    var positions = attributes.position.array;
    var normals = attributes.normal.array;
    var uvs = attributes.uv.array;

    var nVertices = positions.length / 3;

    if (attributes.tangent === undefined) {
      geometry.addAttribute(
        "tangent",
        new THREE.BufferAttribute(new Float32Array(4 * nVertices), 4)
      );
    }

    var tangents = attributes.tangent.array;

    var tan1 = [];
    var tan2 = [];

    for (var i = 0; i < nVertices; i++) {
      tan1[i] = new THREE.Vector3();
      tan2[i] = new THREE.Vector3();
    }

    var vA = new THREE.Vector3();
    var vB = new THREE.Vector3();
    var vC = new THREE.Vector3();
    var uvA = new THREE.Vector2();
    var uvB = new THREE.Vector2();
    var uvC = new THREE.Vector2();
    var sdir = new THREE.Vector3();
    var tdir = new THREE.Vector3();

    function handleTriangle(a, b, c) {
      vA.fromArray(positions, a * 3);
      vB.fromArray(positions, b * 3);
      vC.fromArray(positions, c * 3);

      uvA.fromArray(uvs, a * 2);
      uvB.fromArray(uvs, b * 2);
      uvC.fromArray(uvs, c * 2);

      var x1 = vB.x - vA.x;
      var x2 = vC.x - vA.x;

      var y1 = vB.y - vA.y;
      var y2 = vC.y - vA.y;

      var z1 = vB.z - vA.z;
      var z2 = vC.z - vA.z;

      var s1 = uvB.x - uvA.x;
      var s2 = uvC.x - uvA.x;

      var t1 = uvB.y - uvA.y;
      var t2 = uvC.y - uvA.y;

      var r = 1.0 / (s1 * t2 - s2 * t1);

      sdir.set(
        (t2 * x1 - t1 * x2) * r,
        (t2 * y1 - t1 * y2) * r,
        (t2 * z1 - t1 * z2) * r
      );

      tdir.set(
        (s1 * x2 - s2 * x1) * r,
        (s1 * y2 - s2 * y1) * r,
        (s1 * z2 - s2 * z1) * r
      );

      tan1[a].add(sdir);
      tan1[b].add(sdir);
      tan1[c].add(sdir);

      tan2[a].add(tdir);
      tan2[b].add(tdir);
      tan2[c].add(tdir);
    }

    var groups = geometry.groups;

    if (groups.length === 0) {
      groups = [
        {
          start: 0,
          count: indices.length,
        },
      ];
    }

    for (var i = 0, il = groups.length; i < il; ++i) {
      var group = groups[i];

      var start = group.start;
      var count = group.count;

      for (var j = start, jl = start + count; j < jl; j += 3) {
        handleTriangle(indices[j + 0], indices[j + 1], indices[j + 2]);
      }
    }

    var tmp = new THREE.Vector3();
    var tmp2 = new THREE.Vector3();
    var n = new THREE.Vector3();
    var n2 = new THREE.Vector3();
    var w, t, test;

    function handleVertex(v) {
      n.fromArray(normals, v * 3);
      n2.copy(n);

      t = tan1[v];

      // Gram-Schmidt orthogonalize

      tmp.copy(t);
      tmp.sub(n.multiplyScalar(n.dot(t))).normalize();

      // Calculate handedness

      tmp2.crossVectors(n2, t);
      test = tmp2.dot(tan2[v]);
      w = test < 0.0 ? -1.0 : 1.0;

      tangents[v * 4] = tmp.x;
      tangents[v * 4 + 1] = tmp.y;
      tangents[v * 4 + 2] = tmp.z;
      tangents[v * 4 + 3] = w;
    }

    for (var i = 0, il = groups.length; i < il; ++i) {
      var group = groups[i];

      var start = group.start;
      var count = group.count;

      for (var j = start, jl = start + count; j < jl; j += 3) {
        handleVertex(indices[j + 0]);
        handleVertex(indices[j + 1]);
        handleVertex(indices[j + 2]);
      }
    }
  },

  /**
   * @param  {Array<BufferGeometry>} geometries
   * @param  {Boolean} useGroups
   * @return {BufferGeometry}
   */
  mergeBufferGeometries: function (geometries, useGroups) {
    var isIndexed = geometries[0].index !== null;

    var attributesUsed = new Set(Object.keys(geometries[0].attributes));
    var morphAttributesUsed = new Set(
      Object.keys(geometries[0].morphAttributes)
    );

    var attributes = {};
    var morphAttributes = {};

    var mergedGeometry = new THREE.BufferGeometry();

    var offset = 0;

    for (var i = 0; i < geometries.length; ++i) {
      var geometry = geometries[i];

      // ensure that all geometries are indexed, or none

      if (isIndexed !== (geometry.index !== null)) return null;

      // gather attributes, exit early if they're different

      for (var name in geometry.attributes) {
        if (!attributesUsed.has(name)) return null;

        if (attributes[name] === undefined) attributes[name] = [];

        attributes[name].push(geometry.attributes[name]);
      }

      // gather morph attributes, exit early if they're different

      for (var name in geometry.morphAttributes) {
        if (!morphAttributesUsed.has(name)) return null;

        if (morphAttributes[name] === undefined) morphAttributes[name] = [];

        morphAttributes[name].push(geometry.morphAttributes[name]);
      }

      // gather .userData

      mergedGeometry.userData.mergedUserData =
        mergedGeometry.userData.mergedUserData || [];
      mergedGeometry.userData.mergedUserData.push(geometry.userData);

      if (useGroups) {
        var count;

        if (isIndexed) {
          count = geometry.index.count;
        } else if (geometry.attributes.position !== undefined) {
          count = geometry.attributes.position.count;
        } else {
          return null;
        }

        mergedGeometry.addGroup(offset, count, i);

        offset += count;
      }
    }

    // merge indices

    if (isIndexed) {
      var indexOffset = 0;
      var mergedIndex = [];

      for (var i = 0; i < geometries.length; ++i) {
        var index = geometries[i].index;

        for (var j = 0; j < index.count; ++j) {
          mergedIndex.push(index.getX(j) + indexOffset);
        }

        indexOffset += geometries[i].attributes.position.count;
      }

      mergedGeometry.setIndex(mergedIndex);
    }

    // merge attributes

    for (var name in attributes) {
      var mergedAttribute = this.mergeBufferAttributes(attributes[name]);

      if (!mergedAttribute) return null;

      mergedGeometry.addAttribute(name, mergedAttribute);
    }

    // merge morph attributes

    for (var name in morphAttributes) {
      var numMorphTargets = morphAttributes[name][0].length;

      if (numMorphTargets === 0) break;

      mergedGeometry.morphAttributes = mergedGeometry.morphAttributes || {};
      mergedGeometry.morphAttributes[name] = [];

      for (var i = 0; i < numMorphTargets; ++i) {
        var morphAttributesToMerge = [];

        for (var j = 0; j < morphAttributes[name].length; ++j) {
          morphAttributesToMerge.push(morphAttributes[name][j][i]);
        }

        var mergedMorphAttribute = this.mergeBufferAttributes(
          morphAttributesToMerge
        );

        if (!mergedMorphAttribute) return null;

        mergedGeometry.morphAttributes[name].push(mergedMorphAttribute);
      }
    }

    return mergedGeometry;
  },

  /**
   * @param {Array<BufferAttribute>} attributes
   * @return {BufferAttribute}
   */
  mergeBufferAttributes: function (attributes) {
    var TypedArray;
    var itemSize;
    var normalized;
    var arrayLength = 0;

    for (var i = 0; i < attributes.length; ++i) {
      var attribute = attributes[i];

      if (attribute.isInterleavedBufferAttribute) return null;

      if (TypedArray === undefined) TypedArray = attribute.array.constructor;
      if (TypedArray !== attribute.array.constructor) return null;

      if (itemSize === undefined) itemSize = attribute.itemSize;
      if (itemSize !== attribute.itemSize) return null;

      if (normalized === undefined) normalized = attribute.normalized;
      if (normalized !== attribute.normalized) return null;

      arrayLength += attribute.array.length;
    }

    var array = new TypedArray(arrayLength);
    var offset = 0;

    for (var i = 0; i < attributes.length; ++i) {
      array.set(attributes[i].array, offset);

      offset += attributes[i].array.length;
    }

    return new THREE.BufferAttribute(array, itemSize, normalized);
  },
};
