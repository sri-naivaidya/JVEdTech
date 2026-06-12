import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function CrystalScene3D({ progress = 0, active = true }) {
  const mountRef = useRef(null)
  const progressRef = useRef(progress)
  const activeRef = useRef(active)

  useEffect(() => {
    progressRef.current = progress
  }, [progress])

  useEffect(() => {
    activeRef.current = active
  }, [active])

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return undefined

    const scene = new THREE.Scene()
    scene.background = null

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100)
    camera.position.set(0, 0, 6.4)

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    renderer.domElement.style.display = 'block'
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    mount.appendChild(renderer.domElement)

    const crystalGroup = new THREE.Group()
    scene.add(crystalGroup)

    const crystalGeo = new THREE.OctahedronGeometry(1.05, 0)
    crystalGeo.scale(1, 1.45, 1)

    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x0a1f1a),
      metalness: 0.2,
      roughness: 0.04,
      transmission: 0.72,
      thickness: 2.2,
      ior: 2.4,
      transparent: true,
      emissive: new THREE.Color(0x145c47),
      emissiveIntensity: 0.25,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      side: THREE.DoubleSide,
    })

    const crystal = new THREE.Mesh(crystalGeo, crystalMat)
    crystalGroup.add(crystal)

    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(crystalGeo, 12),
      new THREE.LineBasicMaterial({
        color: 0x7ec8e3,
        transparent: true,
        opacity: 0.45,
      }),
    )
    crystalGroup.add(edges)

    const innerGeo = new THREE.OctahedronGeometry(0.38, 0)
    innerGeo.scale(1, 1.3, 1)
    const innerMat = new THREE.MeshPhysicalMaterial({
      color: 0x7ec8e3,
      emissive: 0x7ec8e3,
      emissiveIntensity: 0.15,
      metalness: 0.5,
      roughness: 0.1,
      transparent: true,
      opacity: 0.35,
    })
    const innerCore = new THREE.Mesh(innerGeo, innerMat)
    crystalGroup.add(innerCore)

    scene.add(new THREE.AmbientLight(0xffffff, 0.12))

    const keyLight = new THREE.PointLight(0x7ec8e3, 2.5, 30)
    keyLight.position.set(3, 4, 5)
    scene.add(keyLight)

    const fillLight = new THREE.PointLight(0xffffff, 1.2, 25)
    fillLight.position.set(-4, -1, 3)
    scene.add(fillLight)

    const rimLight = new THREE.PointLight(0x145c47, 1.8, 20)
    rimLight.position.set(0, -3, -4)
    scene.add(rimLight)

    const backLight = new THREE.PointLight(0x5bb8d9, 0.9, 18)
    backLight.position.set(0, 2, -5)
    scene.add(backLight)

    const particleCount = 140
    const positions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i += 1) {
      const r = 2.5 + Math.random() * 2.5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)
    }
    const particlesGeo = new THREE.BufferGeometry()
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const particlesMat = new THREE.PointsMaterial({
      color: 0x7ec8e3,
      size: 0.045,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const particles = new THREE.Points(particlesGeo, particlesMat)
    scene.add(particles)

    const state = { mouseX: 0, mouseY: 0 }

    const onMove = (e) => {
      const rect = mount.getBoundingClientRect()
      state.mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      state.mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2
    }

    window.addEventListener('mousemove', onMove)

    const resize = () => {
      const w = mount.clientWidth || 1
      const h = mount.clientHeight || 1
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h, false)
    }

    resize()
    const resizeObs = new ResizeObserver(resize)
    resizeObs.observe(mount)

    const clock = new THREE.Clock()
    let raf = 0

    const animate = () => {
      raf = requestAnimationFrame(animate)

      if (!activeRef.current) return

      const p = progressRef.current
      const t = clock.getElapsedTime()
      const spin = 0.35 + p * 2.2

      crystalGroup.rotation.y = t * spin + state.mouseX * 0.5
      crystalGroup.rotation.x = Math.sin(t * 0.5) * 0.12 + state.mouseY * 0.28
      crystalGroup.position.y = Math.sin(t * 0.8) * 0.06 * (1 + p)

      innerCore.rotation.y = -t * spin * 1.3
      innerCore.rotation.x = t * 0.3

      crystalMat.emissiveIntensity = 0.2 + p * 0.65
      innerMat.emissiveIntensity = 0.15 + p * 0.85
      keyLight.intensity = 2.5 + p * 3
      edges.material.opacity = 0.35 + p * 0.4

      const scale = 1 + p * 0.08
      crystalGroup.scale.setScalar(scale)

      particles.rotation.y = t * 0.12
      particlesMat.opacity = 0.35 + p * 0.45

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(raf)
      resizeObs.disconnect()
      window.removeEventListener('mousemove', onMove)

      crystalGeo.dispose()
      crystalMat.dispose()
      innerGeo.dispose()
      innerMat.dispose()
      edges.geometry.dispose()
      edges.material.dispose()
      particlesGeo.dispose()
      particlesMat.dispose()
      renderer.dispose()

      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement)
      }
    }
  }, [])

  return <div ref={mountRef} className="crystal-scene-3d h-full w-full" aria-hidden />
}
