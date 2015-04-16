<?php
/**
 * Created by PhpStorm.
 * User: niaz
 * Date: 02/04/15
 * Time: 15:55
 */

namespace Microlise\SurveyBundle\Form\Type;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class SurveyType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('name')
            ->add('description')
            ->add('save', 'submit', array('label' => 'Next'));
    }

    public function getName()
    {
        return 'survey';
    }

    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'Microlise\SurveyBundle\Entity\Survey',
        ));
    }
}