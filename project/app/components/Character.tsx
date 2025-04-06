
import React, { useRef, useEffect } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three';
const Character = () => {
  const group = useRef()
  const { nodes, materials, animations } = useGLTF('/cartoon boy.glb')
  const { actions } = useAnimations(animations, group)
  console.log(actions);
   useEffect(() => {
    if (!actions) return;

    const poseA = 'Pose  7';
    const poseB = 'Pose  23';
    let current = poseA;
    let timeoutId;

    const switchPose = () => {
      // Fade out all actions first
      Object.values(actions).forEach((action) => action.fadeOut?.(0.5));

      // Play the current one
      const action = actions[current];
      if (action) {
        action.reset().fadeIn(0.5).setLoop(THREE.LoopRepeat).play();
      }

      // Schedule the next switch
      current = current === poseA ? poseB : poseA;
      timeoutId = setTimeout(switchPose, 2000);
    };

    switchPose();

    return () => clearTimeout(timeoutId); // Clean up on unmount
  }, [actions]);
 

  return (
    <group ref={group}  dispose={null}>
      <group name="Scene">
        <group name="Am_male_cartoon_Rigify">
          <skinnedMesh
            name="Beard"
            geometry={nodes.Beard.geometry}
            material={materials.Beard_Chinstrap}
            skeleton={nodes.Beard.skeleton}
            morphTargetDictionary={nodes.Beard.morphTargetDictionary}
            morphTargetInfluences={nodes.Beard.morphTargetInfluences}
          />
          <skinnedMesh
            name="Beard_Base_2_"
            geometry={nodes.Beard_Base_2_.geometry}
            material={materials.Beard_Base}
            skeleton={nodes.Beard_Base_2_.skeleton}
            morphTargetDictionary={nodes.Beard_Base_2_.morphTargetDictionary}
            morphTargetInfluences={nodes.Beard_Base_2_.morphTargetInfluences}
          />
          <group name="CC_Base_Body">
            <skinnedMesh
              name="CC_Base_Body_1"
              geometry={nodes.CC_Base_Body_1.geometry}
              material={materials.Std_Skin_Head}
              skeleton={nodes.CC_Base_Body_1.skeleton}
              morphTargetDictionary={nodes.CC_Base_Body_1.morphTargetDictionary}
              morphTargetInfluences={nodes.CC_Base_Body_1.morphTargetInfluences}
            />
            <skinnedMesh
              name="CC_Base_Body_2"
              geometry={nodes.CC_Base_Body_2.geometry}
              material={materials.Std_Skin_Body}
              skeleton={nodes.CC_Base_Body_2.skeleton}
              morphTargetDictionary={nodes.CC_Base_Body_2.morphTargetDictionary}
              morphTargetInfluences={nodes.CC_Base_Body_2.morphTargetInfluences}
            />
            <skinnedMesh
              name="CC_Base_Body_3"
              geometry={nodes.CC_Base_Body_3.geometry}
              material={materials.Std_Skin_Arm}
              skeleton={nodes.CC_Base_Body_3.skeleton}
              morphTargetDictionary={nodes.CC_Base_Body_3.morphTargetDictionary}
              morphTargetInfluences={nodes.CC_Base_Body_3.morphTargetInfluences}
            />
            <skinnedMesh
              name="CC_Base_Body_4"
              geometry={nodes.CC_Base_Body_4.geometry}
              material={materials.Std_Skin_Leg}
              skeleton={nodes.CC_Base_Body_4.skeleton}
              morphTargetDictionary={nodes.CC_Base_Body_4.morphTargetDictionary}
              morphTargetInfluences={nodes.CC_Base_Body_4.morphTargetInfluences}
            />
            <skinnedMesh
              name="CC_Base_Body_5"
              geometry={nodes.CC_Base_Body_5.geometry}
              material={materials.Std_Nails}
              skeleton={nodes.CC_Base_Body_5.skeleton}
              morphTargetDictionary={nodes.CC_Base_Body_5.morphTargetDictionary}
              morphTargetInfluences={nodes.CC_Base_Body_5.morphTargetInfluences}
            />
            <skinnedMesh
              name="CC_Base_Body_6"
              geometry={nodes.CC_Base_Body_6.geometry}
              material={materials.Std_Eyelash}
              skeleton={nodes.CC_Base_Body_6.skeleton}
              morphTargetDictionary={nodes.CC_Base_Body_6.morphTargetDictionary}
              morphTargetInfluences={nodes.CC_Base_Body_6.morphTargetInfluences}
            />
          </group>
          <group name="CC_Base_Eye">
            <skinnedMesh
              name="CC_Base_Eye_1"
              geometry={nodes.CC_Base_Eye_1.geometry}
              material={materials.Std_Eye_R}
              skeleton={nodes.CC_Base_Eye_1.skeleton}
            />
            <skinnedMesh
              name="CC_Base_Eye_2"
              geometry={nodes.CC_Base_Eye_2.geometry}
              material={materials.Std_Cornea_R}
              skeleton={nodes.CC_Base_Eye_2.skeleton}
            />
            <skinnedMesh
              name="CC_Base_Eye_3"
              geometry={nodes.CC_Base_Eye_3.geometry}
              material={materials.Std_Eye_L}
              skeleton={nodes.CC_Base_Eye_3.skeleton}
            />
            <skinnedMesh
              name="CC_Base_Eye_4"
              geometry={nodes.CC_Base_Eye_4.geometry}
              material={materials.Std_Cornea_L}
              skeleton={nodes.CC_Base_Eye_4.skeleton}
            />
          </group>
          <group name="CC_Base_EyeOcclusion" scale={0.01}>
            <mesh
              name="CC_Base_EyeOcclusion_1"
              castShadow
              receiveShadow
              geometry={nodes.CC_Base_EyeOcclusion_1.geometry}
              material={materials.Std_Eye_Occlusion_R}
              morphTargetDictionary={nodes.CC_Base_EyeOcclusion_1.morphTargetDictionary}
              morphTargetInfluences={nodes.CC_Base_EyeOcclusion_1.morphTargetInfluences}
            />
            <mesh
              name="CC_Base_EyeOcclusion_2"
              castShadow
              receiveShadow
              geometry={nodes.CC_Base_EyeOcclusion_2.geometry}
              material={materials.Std_Eye_Occlusion_L}
              morphTargetDictionary={nodes.CC_Base_EyeOcclusion_2.morphTargetDictionary}
              morphTargetInfluences={nodes.CC_Base_EyeOcclusion_2.morphTargetInfluences}
            />
          </group>
          <group name="CC_Base_TearLine">
            <skinnedMesh
              name="CC_Base_TearLine_1"
              geometry={nodes.CC_Base_TearLine_1.geometry}
              material={materials.Std_Tearline_R}
              skeleton={nodes.CC_Base_TearLine_1.skeleton}
              morphTargetDictionary={nodes.CC_Base_TearLine_1.morphTargetDictionary}
              morphTargetInfluences={nodes.CC_Base_TearLine_1.morphTargetInfluences}
            />
            <skinnedMesh
              name="CC_Base_TearLine_2"
              geometry={nodes.CC_Base_TearLine_2.geometry}
              material={materials.Std_Tearline_L}
              skeleton={nodes.CC_Base_TearLine_2.skeleton}
              morphTargetDictionary={nodes.CC_Base_TearLine_2.morphTargetDictionary}
              morphTargetInfluences={nodes.CC_Base_TearLine_2.morphTargetInfluences}
            />
          </group>
          <group name="CC_Base_Teeth">
            <skinnedMesh
              name="CC_Base_Teeth_1"
              geometry={nodes.CC_Base_Teeth_1.geometry}
              material={materials.Std_Upper_Teeth}
              skeleton={nodes.CC_Base_Teeth_1.skeleton}
            />
            <skinnedMesh
              name="CC_Base_Teeth_2"
              geometry={nodes.CC_Base_Teeth_2.geometry}
              material={materials.Std_Lower_Teeth}
              skeleton={nodes.CC_Base_Teeth_2.skeleton}
            />
          </group>
          <skinnedMesh
            name="CC_Base_Tongue"
            geometry={nodes.CC_Base_Tongue.geometry}
            material={materials.Std_Tongue}
            skeleton={nodes.CC_Base_Tongue.skeleton}
            morphTargetDictionary={nodes.CC_Base_Tongue.morphTargetDictionary}
            morphTargetInfluences={nodes.CC_Base_Tongue.morphTargetInfluences}
          />
          <skinnedMesh
            name="Eyebrow_Male"
            geometry={nodes.Eyebrow_Male.geometry}
            material={materials.Eyebrow}
            skeleton={nodes.Eyebrow_Male.skeleton}
            morphTargetDictionary={nodes.Eyebrow_Male.morphTargetDictionary}
            morphTargetInfluences={nodes.Eyebrow_Male.morphTargetInfluences}
          />
          <skinnedMesh
            name="Hair_Short"
            geometry={nodes.Hair_Short.geometry}
            material={materials.Hair_Short}
            skeleton={nodes.Hair_Short.skeleton}
          />
          <skinnedMesh
            name="Jogging_Pants"
            geometry={nodes.Jogging_Pants.geometry}
            material={materials.Jogging_Pants}
            skeleton={nodes.Jogging_Pants.skeleton}
          />
          <skinnedMesh
            name="Quiff_Hair"
            geometry={nodes.Quiff_Hair.geometry}
            material={materials.Quiff_Hair}
            skeleton={nodes.Quiff_Hair.skeleton}
          />
          <skinnedMesh
            name="Scalp"
            geometry={nodes.Scalp.geometry}
            material={materials.Scalp}
            skeleton={nodes.Scalp.skeleton}
          />
          <skinnedMesh
            name="Sneakers"
            geometry={nodes.Sneakers.geometry}
            material={materials._Sneakers}
            skeleton={nodes.Sneakers.skeleton}
          />
          <skinnedMesh
            name="Toon_Hoodie"
            geometry={nodes.Toon_Hoodie.geometry}
            material={materials.Toon_Hoodie}
            skeleton={nodes.Toon_Hoodie.skeleton}
          />
          <skinnedMesh
            name="Toon_Mustache_1_"
            geometry={nodes.Toon_Mustache_1_.geometry}
            material={materials.Toon_Mustache}
            skeleton={nodes.Toon_Mustache_1_.skeleton}
            morphTargetDictionary={nodes.Toon_Mustache_1_.morphTargetDictionary}
            morphTargetInfluences={nodes.Toon_Mustache_1_.morphTargetInfluences}
          />
          <primitive object={nodes.root} />
          <primitive object={nodes['MCH-torsoparent']} />
          <primitive object={nodes['MCH-hand_ikparentL']} />
          <primitive object={nodes['MCH-upper_arm_ik_targetparentL']} />
          <primitive object={nodes['MCH-hand_ikparentR']} />
          <primitive object={nodes['MCH-upper_arm_ik_targetparentR']} />
          <primitive object={nodes['MCH-foot_ikparentL']} />
          <primitive object={nodes['MCH-thigh_ik_targetparentL']} />
          <primitive object={nodes['MCH-foot_ikparentR']} />
          <primitive object={nodes['MCH-thigh_ik_targetparentR']} />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/cartoon boy.glb')

export default Character
