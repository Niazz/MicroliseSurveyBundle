<?php
/**
 * Created by PhpStorm.
 * User: niaz
 * Date: 02/04/15
 * Time: 17:55
 */

namespace Microlise\SurveyBundle\Form\Type;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;

use Symfony\Component\OptionsResolver\OptionsResolver;

class QuestionType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder

            ->add('question')

            ->add('surveyid', 'entity',array(
                'class' => 'MicroliseSurveyBundle:Survey',
                'data_class' => 'Microlise\SurveyBundle\Entity\Survey',
                'required'   =>  false,
                'property' => 'id',
            ))


         /*   ->add('surveyid', 'entity',array(
                'class' => 'MicroliseSurveyBundle:Survey',
                'data_class' => 'Microlise\SurveyBundle\Entity\Survey',
                'required'   =>  false,
                'property' => 'id',
            ))*/

            /*

                ->add('surveyid', 'entity', array(
                     'label' => 'Select correct survey:',
                     'class' => 'MicroliseSurveyBundle:Survey',
                     'property' => 'name',

                 ))*/

            ->add('save', 'submit', array('label' => 'Save Question'));

        //
    /*    $builder->add(
            'type',
            'choice',
            array(
                'choices' => array(
                    'open_ended' => 'open_ended',
                    'multiple_choice_single' => 'multiple_choice_single_answer',
                    'multiple_choice_multiple' => 'multiple_choice_multiple_answers'
                ),
                'required' => true
            )
        );
        $builder->add(
            'commentAllowed',
            'checkbox',
            array('required' => true)
        );
        $builder->add(
            'commentLabel',
            'text',
            array('required' => false)
        );
        //

        $builder->addEventListener(FormEvents::PRE_SET_DATA, function (FormEvent $event) {
            // ... adding the name field if needed
            $survey = $event->getData();
            $form = $event->getForm();

            // check if the Product object is "new"
            // If no data is passed to the form, the data is "null".
            // This should be considered a new "Product"
            if (!$survey || null === $survey->getId()) {
                $form->add('name', 'text');
            }
        });*/

    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'validation_groups' => false,
        ));
    }

    public function getName()
    {
        return 'question';
    }

    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'Microlise\SurveyBundle\Entity\Question',
        ));
    }
}