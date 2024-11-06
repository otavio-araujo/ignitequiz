import { Dimensions, Text } from "react-native"
import Animated, { Keyframe, runOnJS } from "react-native-reanimated"

import { Option } from "../Option"
import { styles } from "./styles"

type QuestionProps = {
  title: string
  alternatives: string[]
}

type Props = {
  question: QuestionProps
  alternativeSelected?: number | null
  setAlternativeSelected?: (value: number) => void
  onMount: () => void
}

const WINDOW_WIDTH = Dimensions.get("window").width

export function Question({
  question,
  alternativeSelected,
  setAlternativeSelected,
  onMount,
}: Props) {
  const enteringKeyframe = new Keyframe({
    0: {
      opacity: 0,
      translateX: WINDOW_WIDTH,
      transform: [{ rotate: "90deg" }],
    },
    70: { opacity: 0.3 },
    100: { opacity: 1, translateX: 0, transform: [{ rotate: "0deg" }] },
  })

  const exitingKeyframe = new Keyframe({
    0: {
      opacity: 1,
      translateX: 0,
      transform: [{ rotate: "0deg" }],
    },
    30: { opacity: 0.3 },
    100: {
      opacity: 0,
      translateX: WINDOW_WIDTH * -1,
      transform: [{ rotate: "-90deg" }],
    },
  })

  return (
    <Animated.View
      entering={enteringKeyframe.duration(400)}
      exiting={exitingKeyframe.duration(400).withCallback((finished) => {
        "worklet"
        if (finished) {
          runOnJS(onMount)()
        }
      })}
      style={styles.container}
    >
      <Text style={styles.title}>{question.title}</Text>

      {question.alternatives.map((alternative, index) => (
        <Option
          key={index}
          title={alternative}
          checked={alternativeSelected === index}
          onPress={() =>
            setAlternativeSelected && setAlternativeSelected(index)
          }
        />
      ))}
    </Animated.View>
  )
}
