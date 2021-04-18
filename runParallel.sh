#! /bin/zsh

run () {
  osascript -e "tell app \"Terminal\" to do script \"cd '/Users/ihormo/Desktop/Study/Year_2_Trim_2/Evolutionary Algorithms/Lab' && npm run start -- $1\""
}

# run 'F15_deba1'
# run 'F16_deba2'
# run 'F18_deba3'
# run 'F19_deba4'

# run 'F20_Rastrigin'
# run 'F20_m2_Rastrigin'
# run 'F22_Griewangk'
# run 'D6_Five_Uneven_Peak_Trap'
run 'F20_m_Rastrigin'
run 'F23_Schwefel'
run 'F24_Generalized_Shubert_dim_1'
run 'F24_Generalized_Shubert_dim_2'
run 'F25_Ackley'
run 'F28_Vincent'
run 'F31_Xin_She_Yang_2_dim_1'
run 'F31_Xin_She_Yang_2_dim_2'
run 'F42_5_hills_4_valleys'
run 'F45_Himmelblau'
run 'F46_six_hump_camel_back'
run 'F50_Easom'

